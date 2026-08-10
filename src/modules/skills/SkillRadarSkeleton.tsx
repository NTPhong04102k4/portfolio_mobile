/**
 * Stand-in for `SkillsRadar` while its chunk (chart.js + react-chartjs-2)
 * downloads.
 *
 * The chart panel is pinned to the same 320px height the real chart uses, so
 * the swap does not push the experience blocks below it down the page.
 */
export function SkillsRadarSkeleton() {
  return (
    <section className="skills-radar" aria-busy="true">
      <span className="sr-only" role="status">
        Đang tải biểu đồ kỹ năng…
      </span>

      <header className="skills-radar__header" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar--title" />
        <div className="skeleton-bar skeleton-bar--subtitle" />
      </header>

      <div
        className="skills-radar__chart skeleton-bar skeleton-bar--chart"
        aria-hidden="true"
      />
    </section>
  );
}
