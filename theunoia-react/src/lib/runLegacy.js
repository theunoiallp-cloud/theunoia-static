/**
 * Runs a section's original animation script inside a React component, and cleans up after it.
 *
 * The scripts were written for plain pages: they add window/document listeners, start
 * requestAnimationFrame loops, timers and observers, and wait for DOMContentLoaded.
 * Here each script gets its own "scope": those globals are swapped for tracked versions,
 * so when the component unmounts (the visitor goes to another page) every listener, loop,
 * timer and observer the script started is stopped. Coming back starts it fresh.
 */
export function runLegacy(codes, { name = 'section' } = {}) {
  let alive = true;
  const listeners = [];   // [target, type, fn, opts]
  const frames = new Set();
  const timeouts = new Set();
  const intervals = new Set();
  const observers = [];

  const loaded = () => document.readyState === 'complete' || document.readyState === 'interactive';
  const add = (target) => function (type, fn, opts) {
    if (!alive || !fn) return;
    // the page has already loaded inside the React app: fire these at once
    if ((type === 'DOMContentLoaded' || type === 'load') && loaded()) {
      const id = setTimeout(() => { timeouts.delete(id); if (alive) (fn.handleEvent ? fn.handleEvent(new Event(type)) : fn.call(target, new Event(type))); }, 0);
      timeouts.add(id);
      if (type === 'DOMContentLoaded') return;
    }
    target.addEventListener(type, fn, opts);
    listeners.push([target, type, fn, opts]);
  };
  const remove = (target) => function (type, fn, opts) { target.removeEventListener(type, fn, opts); };

  const raf = (cb) => {
    if (!alive) return 0;
    const id = requestAnimationFrame((t) => { frames.delete(id); if (alive) cb(t); });
    frames.add(id);
    return id;
  };
  const caf = (id) => { frames.delete(id); cancelAnimationFrame(id); };
  const st = (cb, ms, ...a) => {
    if (!alive) return 0;
    const id = setTimeout(() => { timeouts.delete(id); if (alive) (typeof cb === 'function' ? cb(...a) : null); }, ms);
    timeouts.add(id);
    return id;
  };
  const ct = (id) => { timeouts.delete(id); clearTimeout(id); };
  const si = (cb, ms, ...a) => {
    if (!alive) return 0;
    const id = setInterval(() => { if (alive) cb(...a); }, ms);
    intervals.add(id);
    return id;
  };
  const ci = (id) => { intervals.delete(id); clearInterval(id); };
  const track = (Base) => Base && class extends Base {
    constructor(...a) { super(...a); observers.push(this); }
  };
  const IO = track(window.IntersectionObserver);
  const RO = track(window.ResizeObserver);
  const MO = track(window.MutationObserver);

  const winAdd = add(window), winRemove = remove(window);
  const docAdd = add(document), docRemove = remove(document);
  const OVERRIDE_WIN = {
    addEventListener: winAdd, removeEventListener: winRemove,
    requestAnimationFrame: raf, cancelAnimationFrame: caf,
    setTimeout: st, clearTimeout: ct, setInterval: si, clearInterval: ci,
    IntersectionObserver: IO, ResizeObserver: RO, MutationObserver: MO,
  };
  const bind = (t, k) => { const v = Reflect.get(t, k); return typeof v === 'function' && !/^[A-Z]/.test(String(k)) ? v.bind(t) : v; };
  const win = new Proxy(window, {
    get: (t, k) => (k in OVERRIDE_WIN ? OVERRIDE_WIN[k] : k === 'window' || k === 'self' ? win : k === 'document' ? doc : bind(t, k)),
    set: (t, k, v) => { t[k] = v; return true; },
    has: (t, k) => k in t,
  });
  const doc = new Proxy(document, {
    get: (t, k) => (k === 'addEventListener' ? docAdd : k === 'removeEventListener' ? docRemove : k === 'defaultView' ? win : bind(t, k)),
    set: (t, k, v) => { t[k] = v; return true; },
  });

  const PARAMS = ['window', 'self', 'document', 'addEventListener', 'removeEventListener',
    'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
    'IntersectionObserver', 'ResizeObserver', 'MutationObserver'];
  const ARGS = [win, win, doc, winAdd, winRemove, raf, caf, st, ct, si, ci, IO, RO, MO];

  codes.forEach((code, i) => {
    try {
      // eslint-disable-next-line no-new-func
      // (not strict mode: the original scripts were written as ordinary page scripts)
      new Function(...PARAMS, `${code}\n//# sourceURL=theunoia/${name}-${i + 1}.js`)(...ARGS);
    } catch (e) {
      console.error(`[${name}] script ${i + 1} failed`, e);
    }
  });

  return function cleanup() {
    alive = false;
    listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
    frames.forEach((id) => cancelAnimationFrame(id));
    timeouts.forEach((id) => clearTimeout(id));
    intervals.forEach((id) => clearInterval(id));
    observers.forEach((o) => { try { o.disconnect(); } catch { /* already gone */ } });
  };
}
