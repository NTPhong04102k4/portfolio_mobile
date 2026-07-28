import { useState } from 'react';

import { cvV1Data } from '@/content/cv_v1.parsed';
import { NativeCodeShowcase } from '@/modules/skills/NativeCodeShowCase';

export function CvExperience() {
  const { experience, previousExperience } = cvV1Data;

  return (
    <article className="cv-section cv-section--experience">
      {/* ── Current Enterprise Experience: CredHR ─────────────── */}
      <div className="experience-block">
        <header className="experience-block__header">
          <span className="badge-latest">HOT / LATEST ({experience.period})</span>
          <h3>{experience.company}</h3>
          <p className="cv-section__meta">
            <span>{experience.role}</span> | <span>{experience.period}</span> |{' '}
            <span>{experience.location}</span>
          </p>
          <div className="experience-block__tech-chips">
            {experience.techStack.map((tech) => (
              <span key={tech} className="tech-chip--sm">{tech}</span>
            ))}
          </div>
        </header>
        <p className="experience-summary">{experience.summary}</p>

        {experience.playStoreLink && (
          <a
            href={experience.playStoreLink}
            target="_blank"
            rel="noreferrer"
            className="store-badge"
          >
            <span className="store-badge__icon">▶</span>
            Google Play — Ứng dụng nội bộ
          </a>
        )}

        <DetailCategoryGrid categories={experience.detailCategories} />
      </div>

      {/* ── Previous Experience: Eatsy JSC ────────────────────── */}
      <div className="experience-block experience-block--previous">
        <header className="experience-block__header">
          <h3>{previousExperience.company}</h3>
          <p className="cv-section__meta">
            <span>{previousExperience.role}</span> | <span>{previousExperience.period}</span> |{' '}
            <span>{previousExperience.location}</span>
          </p>
          <div className="experience-block__tech-chips">
            {previousExperience.techStack.map((tech) => (
              <span key={tech} className="tech-chip--sm">{tech}</span>
            ))}
          </div>
        </header>
        <p className="experience-summary">{previousExperience.summary}</p>

        <DetailCategoryGrid categories={previousExperience.detailCategories} />
      </div>

      {/* Native Code Playground Showcase */}
      <NativeCodeShowcase />
    </article>
  );
}

// ── Detail Category Grid ────────────────────────────────────────────
type CategoryItem = {
  title: string;
  icon: string;
  items: string[];
};

function DetailCategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className="detail-categories">
      {categories.map((cat) => (
        <DetailCategoryTile key={cat.title} category={cat} />
      ))}
    </div>
  );
}

function DetailCategoryTile({ category }: { category: CategoryItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`detail-category ${isOpen ? 'detail-category--open' : ''}`}>
      <button
        type="button"
        className="detail-category__header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="detail-category__icon">{category.icon}</span>
        <span className="detail-category__title">{category.title}</span>
        <span className="detail-category__caret">{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && (
        <ul className="detail-category__items">
          {category.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}