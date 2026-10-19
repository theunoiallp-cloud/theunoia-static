import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/aim-vision/markup.html?raw';
import css from '../../content/home/aim-vision/style.css?raw';
import meta from '../../content/home/aim-vision/meta.json';
import script1 from '../../content/home/aim-vision/script-1.js?raw';

/** Our Vision and Our Mission, with the animated town. */
export default function AimVision() {
  return <Legacy name="aim-vision" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
