import { useEffect } from 'react';
import { Legacy, useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import markup from '../content/pages/contact/markup.html?raw';
import css from '../content/pages/contact/style.css?raw';
import meta from '../content/pages/contact/meta.json';
import navJs from '../content/nav.js?raw';
import script1 from '../content/pages/contact/script-1.js?raw';
import { submitContactForm } from '../lib/supabase.js';

/** Contact Us page with direct Supabase integration. */
export default function Contact() {
  useTitle(meta.title);
  useRestoreDocument();

  useEffect(() => {
    window.__THEUNOiA_SUBMIT_CONTACT__ = submitContactForm;
    return () => {
      delete window.__THEUNOiA_SUBMIT_CONTACT__;
    };
  }, []);

  return <Legacy name="contact" root={null} markup={markup} css={css} scripts={[script1, navJs]} />;
}
