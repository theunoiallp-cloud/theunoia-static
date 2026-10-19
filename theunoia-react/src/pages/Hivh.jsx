import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/hivh/markup.html?raw';
import css from '../content/pages/hivh/style.css?raw';
import meta from '../content/pages/hivh/meta.json';
import navJs from '../content/nav.js?raw';

/** Hivh: the community. */
export default function Hivh() {
  useTitle(meta.title);
  useRestoreDocument();
  return <Legacy name="hivh" root={null} markup={markup} css={css} scripts={[navJs]} />;
}
