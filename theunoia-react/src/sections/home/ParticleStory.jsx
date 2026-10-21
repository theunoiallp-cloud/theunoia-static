import { useEffect } from 'react';
import { runLegacy } from '../../lib/runLegacy.js';
import markup from '../../content/home/particle-story/markup.html?raw';
import css from '../../content/home/particle-story/style.css?raw';
import meta from '../../content/home/particle-story/meta.json';
import script1 from '../../content/home/particle-story/script-1.js?raw';

/** Slide 2: "Our Story" told by particles that form a new shape for each of the seven parts. */
export default function ParticleStory() {
  useEffect(() => {
    let cancel = null;
    let unmounted = false;

    // Dynamically load Three.js so it never delays critical initial render or hero
    import('three').then((threeModule) => {
      if (unmounted) return;
      if (typeof window !== 'undefined') {
        window.THREE = threeModule;
      }
      cancel = runLegacy([script1], { name: 'particle-story' });
    });

    return () => {
      unmounted = true;
      if (cancel) cancel();
    };
  }, []);

  return (
    <>
      <section
        {...(meta.root?.attrs || {})}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      {css ? <style data-block="particle-story" dangerouslySetInnerHTML={{ __html: css }} /> : null}
    </>
  );
}

