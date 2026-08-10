/**
 * Placeholder shown while a lazily-loaded route chunk is still downloading.
 *
 * It deliberately reuses `.portfolio-section` so the skeleton occupies the same
 * shell — same background, padding and radius — as the page that replaces it.
 * Only the inner blocks are grey bars, which keeps the swap from shifting the
 * layout when the real content arrives.
 */
export function RouteSkeleton() {
  return (
    <section className="portfolio-section route-skeleton" aria-busy="true">
      {/* One polite announcement instead of a stream of bar elements. */}
      <span className="sr-only" role="status">
        Đang tải nội dung trang…
      </span>

      <header className="portfolio-section__header" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar--title" />
        <div className="skeleton-bar skeleton-bar--subtitle" />
      </header>

      <div className="portfolio-section__body" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar--panel" />

        <div className="route-skeleton__rows">
          <div className="skeleton-bar skeleton-bar--line" />
          <div className="skeleton-bar skeleton-bar--line skeleton-bar--short" />
          <div className="skeleton-bar skeleton-bar--line" />
        </div>

        <div className="route-skeleton__chips">
          <div className="skeleton-bar skeleton-bar--chip" />
          <div className="skeleton-bar skeleton-bar--chip" />
          <div className="skeleton-bar skeleton-bar--chip" />
          <div className="skeleton-bar skeleton-bar--chip" />
        </div>
      </div>
    </section>
  );
}
