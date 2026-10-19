import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/particle-story/markup.html?raw';
import css from '../../content/home/particle-story/style.css?raw';
import meta from '../../content/home/particle-story/meta.json';
import script1 from '../../content/home/particle-story/script-1.js?raw';
import * as THREE from 'three';

// the particle scene was written for the global THREE (r128)
window.THREE = THREE;

/** Slide 2: "Our Story" told by particles that form a new shape for each of the seven parts. */
export default function ParticleStory() {
  return <Legacy name="particle-story" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
