import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/blog/markup.html?raw';
import css from '../content/pages/blog/style.css?raw';
import meta from '../content/pages/blog/meta.json';
import navJs from '../content/nav.js?raw';
import script1 from '../content/pages/blog/script-1.js?raw';

/** Blog. */
export default function Blog() {
  useTitle(meta.title);
  useRestoreDocument();
  return <Legacy name="blog" root={null} markup={markup} css={css} scripts={[script1, navJs]} />;
}
