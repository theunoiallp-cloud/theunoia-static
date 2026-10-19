import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/footer/markup.html?raw';
import css from '../../content/home/footer/style.css?raw';
import meta from '../../content/home/footer/meta.json';

/** The navy site footer. */
export default function SiteFooter() {
  return <Legacy name="footer" root={meta.root} markup={markup} css={css} scripts={[]} />;
}
