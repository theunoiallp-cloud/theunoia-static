import { Legacy } from '../../lib/Legacy.jsx';
import markup from '../../content/home/products/markup.html?raw';
import css from '../../content/home/products/style.css?raw';
import meta from '../../content/home/products/meta.json';
import script1 from '../../content/home/products/script-1.js?raw';

/** Products of THEUNOiA: the Hunhar and Hivh cards. */
export default function Products() {
  return <Legacy name="products" root={meta.root} markup={markup} css={css} scripts={[script1]} />;
}
