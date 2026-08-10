import { Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';

import { ICON_SIZE } from '@/config/icons';
import { useI18n } from '@/i18n/I18nContext';
import { prefetchRoute } from '@/routes/lazyRoutes';
import { NAV_ITEMS } from '@/routes/paths';

const DRAWER_ID = 'mobile-nav-drawer';

/**
 * Navigation for narrow viewports: a hamburger button that opens a slide-in
 * drawer. Hidden from `sm` (640px) up, where the header's inline nav takes over
 * — the two are mutually exclusive in CSS, so only one is ever interactive.
 */
export function MobileNav() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /**
   * Closing also hands focus back to the hamburger, so a keyboard user is never
   * dropped at the top of the document. Doing it here rather than in an effect
   * cleanup keeps the ref read in the same tick the button still exists.
   */
  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* Escape closes the drawer, matching what a dialog is expected to do. */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  /**
   * Lock body scroll while open. Without this the page behind the drawer keeps
   * scrolling under the user's finger, which reads as the drawer being broken.
   * The previous value is restored rather than blanked, so an unrelated lock
   * elsewhere would survive.
   */
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  /* Move focus into the drawer on open. The return trip is handled by `close`. */
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
  }, [isOpen]);

  /**
   * Portalled to <body> rather than rendered where it sits in the tree.
   *
   * `.portfolio-header` sets `backdrop-filter`, which makes it a containing
   * block for `position: fixed` descendants — rendered in place, the backdrop
   * would size itself to the header box instead of the viewport. The header
   * also opens a stacking context (sticky + `z-index: 100`), which would cap
   * the drawer's own z-index inside it. The portal escapes both at once.
   */
  const drawer = createPortal(
    <div className="mobile-nav__backdrop" onClick={close} role="presentation">
      <div
        id={DRAWER_ID}
        className="mobile-nav__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Điều hướng"
        /* The backdrop closes on click; taps inside the panel must not
           bubble up to it. */
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mobile-nav__drawer-head">
          <span className="mobile-nav__drawer-title">Điều hướng</span>
          <button
            ref={closeRef}
            type="button"
            className="mobile-nav__close"
            onClick={close}
            aria-label="Đóng menu"
          >
            <X size={ICON_SIZE.lg} aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-nav__list" aria-label="Main">
          {NAV_ITEMS.map(({ id, path, icon: Icon, labelKey }) => (
            <NavLink
              key={id}
              to={path}
              end={id === 'about'}
              className={({ isActive }) =>
                isActive ? 'mobile-nav__item is-active' : 'mobile-nav__item'
              }
              onClick={close}
              onMouseEnter={() => prefetchRoute(id)}
              onFocus={() => prefetchRoute(id)}
              onTouchStart={() => prefetchRoute(id)}
            >
              <Icon size={ICON_SIZE.md} aria-hidden="true" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-nav__trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Mở menu điều hướng"
        aria-expanded={isOpen}
        aria-controls={DRAWER_ID}
      >
        <Menu size={ICON_SIZE.lg} aria-hidden="true" />
      </button>

      {isOpen && drawer}
    </>
  );
}
