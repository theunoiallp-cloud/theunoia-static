import { useLayoutEffect, useEffect, useRef } from 'react';
import { runLegacy } from './runLegacy.js';

/**
 * One block of the site: its own root element, markup, styles and animation scripts.
 *  - root:    { tag, attrs } of the block's outer element (e.g. <section id="luna">); null = no outer element
 *  - markup:  the inner HTML
 *  - css:     styles that exist only while this block is on screen (no CSS leaks between pages)
 *  - scripts: the block's original scripts, run with automatic clean-up (see runLegacy.js)
 */
export function Legacy({ name, root, markup, css, scripts = [] }) {
  const ref = useRef(null);
  const Tag = root?.tag || 'div';

  // Synchronize dynamic attributes if root changes on client
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (root) Object.entries(root.attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    else el.style.display = 'contents';
  }, [root]);

  useEffect(() => runLegacy(scripts, { name }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Tag
        ref={ref}
        {...(root?.attrs || {})}
        style={!root ? { display: 'contents' } : undefined}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      {css ? <style data-block={name} dangerouslySetInnerHTML={{ __html: css }} /> : null}
    </>
  );
}

/** Puts <html>/<body> back exactly as they were before a page's scripts touched them. */
export function useRestoreDocument() {
  useLayoutEffect(() => {
    const h = document.documentElement, b = document.body;
    const saved = { hc: h.className, hs: h.getAttribute('style'), bc: b.className, bs: b.getAttribute('style') };
    return () => {
      h.className = saved.hc; b.className = saved.bc;
      saved.hs == null ? h.removeAttribute('style') : h.setAttribute('style', saved.hs);
      saved.bs == null ? b.removeAttribute('style') : b.setAttribute('style', saved.bs);
    };
  }, []);
}

export function useTitle(title) {
  useEffect(() => { if (title) document.title = title; }, [title]);
}
