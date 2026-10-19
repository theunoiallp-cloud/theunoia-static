import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/contact/markup.html?raw';
import css from '../content/pages/contact/style.css?raw';
import meta from '../content/pages/contact/meta.json';
import navJs from '../content/nav.js?raw';
import script1 from '../content/pages/contact/script-1.js?raw';
import { API_BASE_URL } from '../config/api.js';

if (typeof window !== 'undefined') {
  window.__THEUNOiA_API_BASE_URL__ = API_BASE_URL;
}

/** Contact Us. */
export default function Contact() {
  useTitle(meta.title);
  useRestoreDocument();
  return <Legacy name="contact" root={null} markup={markup} css={css} scripts={[script1, navJs]} />;
}

