import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/story/markup.html?raw';
import css from '../content/pages/story/style.css?raw';
import meta from '../content/pages/story/meta.json';
import navJs from '../content/nav.js?raw';
import script1 from '../content/pages/story/script-1.js?raw';
import script2 from '../content/pages/story/script-2.js?raw';

/** Our Story: the book you page through. */
export default function Story() {
  useTitle(meta.title);
  useRestoreDocument();
  return <Legacy name="story" root={null} markup={markup} css={css} scripts={[script1, script2, navJs]} />;
}
