import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/inspirations/markup.html?raw';
import css from '../../content/home/inspirations/style.css?raw';
import meta from '../../content/home/inspirations/meta.json';
import script1 from '../../content/home/inspirations/script-1.js?raw';

/** Our Inspirations. */
export default function Inspirations() {
  return <Legacy name="inspirations" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
