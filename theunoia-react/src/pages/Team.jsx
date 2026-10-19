import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/team/markup.html?raw';
import css from '../content/pages/team/style.css?raw';
import meta from '../content/pages/team/meta.json';
import navJs from '../content/nav.js?raw';
import script1 from '../content/pages/team/script-1.js?raw';

/** Team: the makers behind THEUNOiA. */
export default function Team() {
  useTitle(meta.title);
  useRestoreDocument();
  return <Legacy name="team" root={null} markup={markup} css={css} scripts={[script1, navJs]} />;
}
