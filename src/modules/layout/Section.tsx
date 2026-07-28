import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="portfolio-section">
      <header className="portfolio-section__header">
        <h2>{title}</h2>
        {subtitle && <p className="portfolio-section__subtitle">{subtitle}</p>}
      </header>
      <div className="portfolio-section__body">{children}</div>
    </section>
  );
}