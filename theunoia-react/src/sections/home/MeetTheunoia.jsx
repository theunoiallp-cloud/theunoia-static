import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/meet-theunoia/markup.html?raw';
import css from '../../content/home/meet-theunoia/style.css?raw';
import meta from '../../content/home/meet-theunoia/meta.json';
import script1 from '../../content/home/meet-theunoia/script-1.js?raw';

/** Meet THEUNOiA: the opening animation, the note and the cabinet of nine drawers. */
export default function MeetTheunoia() {
  return <Legacy name="meet-theunoia" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
