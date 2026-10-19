import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/squad/markup.html?raw';
import css from '../../content/home/squad/style.css?raw';
import meta from '../../content/home/squad/meta.json';
import script1 from '../../content/home/squad/script-1.js?raw';

/** Meet the Squad: the rotating photo cards around Luna. */
export default function Squad() {
  return <Legacy name="squad" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
