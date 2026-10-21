import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ current = '' }) {
  const [open, setOpen] = useState(false);
  const location = useLocation ? useLocation() : { pathname: '' };

  useEffect(() => {
    setOpen(false);
  }, [location?.pathname]);

  return (
    <header className={`tn-bar ${open ? 'tn-open' : ''}`} data-tn>
      <div className="tn-in">
        <Link className="tn-logo" to="/" aria-label="THEUNOiA home">
          <img src="/assets/logo.png" width="438" height="88" alt="THEUNOiA" />
        </Link>
        <button
          className="tn-burger"
          type="button"
          aria-expanded={open}
          aria-controls="tn-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span></span>
        </button>
        <ul className="tn-links" id="tn-menu">
          <li><Link to="/story" aria-current={current === 'story' ? 'page' : undefined}>Our Story</Link></li>
          <li><Link to="/team" aria-current={current === 'team' ? 'page' : undefined}>Team</Link></li>
          <li><Link to="/hivh" aria-current={current === 'hivh' ? 'page' : undefined}>Hivh</Link></li>
          <li><Link to="/hunhar" aria-current={current === 'hunhar' ? 'page' : undefined}>Hunhar</Link></li>
          <li><Link to="/blog" aria-current={current === 'blog' ? 'page' : undefined}>Blog</Link></li>
          <li><Link className="tn-cta" to="/contact">Contact Us</Link></li>
        </ul>
      </div>
    </header>
  );
}
