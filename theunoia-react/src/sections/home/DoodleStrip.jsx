import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/doodle-strip/markup.html?raw';
import css from '../../content/home/doodle-strip/style.css?raw';
import meta from '../../content/home/doodle-strip/meta.json';
import script1 from '../../content/home/doodle-strip/script-1.js?raw';

/** The doodle strip above the footer ("Nagpur Builds"). */
export default function DoodleStrip() {
  return <Legacy name="doodle-strip" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
