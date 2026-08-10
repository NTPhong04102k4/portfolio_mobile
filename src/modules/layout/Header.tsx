import { FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { CV_PDF_URL } from '@/config/assets';
import { ICON_SIZE } from '@/config/icons';
import { useI18n } from '@/i18n/I18nContext';
import { prefetchRoute } from '@/routes/lazyRoutes';
import { NAV_ITEMS } from '@/routes/paths';

import { MobileNav } from './MobileNav';

/**
 * Hoisted so the four `NavLink`s reuse one function reference instead of
 * allocating a fresh closure per item on every render.
 */
const navItemClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'portfolio-header__nav-item is-active' : 'portfolio-header__nav-item';

export function Header() {
  const { t } = useI18n();

  return (
    <header className="portfolio-header">
      {/* Brand, plus the hamburger that replaces the inline nav on mobile.
          The wrapper is `display: contents` on desktop, so the brand stays a
          direct flex child of the header exactly as before. */}
      <div className="portfolio-header__top">
        <div className="portfolio-header__brand">
          <span className="portfolio-header__name">Nguyễn Thế Phong</span>
          <span className="portfolio-header__role">
            Mobile Engineer · Swift / Kotlin / Flutter / RN
          </span>
        </div>

        <MobileNav />
      </div>

      {/* Center Navigation Bar */}
      <nav className="portfolio-header__nav" aria-label="Main">
        {NAV_ITEMS.map(({ id, path, icon: Icon, labelKey }) => (
          <NavLink
            key={id}
            to={path}
            // Without `end`, the index route would stay active on every page.
            end={id === 'about'}
            className={navItemClass}
            /* Start fetching the route chunk on intent rather than on click.
               `focus` covers keyboard users and `touchStart` fires a beat
               before the tap resolves, so mobile gets a head start too. */
            onMouseEnter={() => prefetchRoute(id)}
            onFocus={() => prefetchRoute(id)}
            onTouchStart={() => prefetchRoute(id)}
          >
            <Icon className="nav-item__icon" size={ICON_SIZE.md} aria-hidden="true" />
            <span className="nav-item__label">{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right Controls & Actions */}
      {/* Theme + language toggles are intentionally not mounted — see HeaderControls. */}
      <div className="portfolio-header__right">
        <a
          href={CV_PDF_URL}
          className="portfolio-header__cv-button"
          target="_blank"
          rel="noreferrer"
        >
          <FileText size={ICON_SIZE.md} aria-hidden="true" />
          CV PDF
        </a>
      </div>
    </header>
  );
}
