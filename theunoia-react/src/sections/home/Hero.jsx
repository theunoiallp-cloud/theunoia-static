import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/hero/markup.html?raw';
import css from '../../content/home/hero/style.css?raw';
import meta from '../../content/home/hero/meta.json';
import script1 from '../../content/home/hero/script-1.js?raw';
import script2 from '../../content/home/hero/script-2.js?raw';
import script3 from '../../content/home/hero/script-3.js?raw';
import script4 from '../../content/home/hero/script-4.js?raw';

/** Hero: the headline, the gentleman with the computer head and the pixel skyline. */
export default function Hero() {
  return <Legacy name="hero" root={meta.root} markup={markup} css={css} scripts={[script1, script2, script3, script4]} />;
}
