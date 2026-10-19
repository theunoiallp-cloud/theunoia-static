import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/independence/markup.html?raw';
import css from '../../content/home/independence/style.css?raw';
import meta from '../../content/home/independence/meta.json';
import script1 from '../../content/home/independence/script-1.js?raw';

/** Independence Starts Here: the animated river scene and the two hands. */
export default function Independence() {
  return <Legacy name="independence" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
