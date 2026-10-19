import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/luna/markup.html?raw';
import css from '../../content/home/luna/style.css?raw';
import meta from '../../content/home/luna/meta.json';
import script1 from '../../content/home/luna/script-1.js?raw';

/** Luna the mascot: the LUNA poster, Since 2025 and the Revolution map. */
export default function Luna() {
  return <Legacy name="luna" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
