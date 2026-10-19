import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/hunhar/markup.html?raw';
import css from '../content/pages/hunhar/style.css?raw';
import meta from '../content/pages/hunhar/meta.json';
import navJs from '../content/nav.js?raw';

/** Hunhar: the platform. */
export default function Hunhar() {
  useTitle(meta.title);
  useRestoreDocument();
  return <Legacy name="hunhar" root={null} markup={markup} css={css} scripts={[navJs]} />;
}
