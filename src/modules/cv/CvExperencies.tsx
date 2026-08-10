import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';

import { type AppIcon, ICON_SIZE } from '@/config/icons';
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
            <Play className="store-badge__icon" size={ICON_SIZE.sm} aria-hidden="true" />
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
  icon: AppIcon;
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
  const { icon: Icon, title, items } = category;
  const Caret = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className={`detail-category ${isOpen ? 'detail-category--open' : ''}`}>
      <button
        type="button"
        className="detail-category__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <Icon className="detail-category__icon" size={ICON_SIZE.md} aria-hidden="true" />
        <span className="detail-category__title">{title}</span>
        <Caret className="detail-category__caret" size={ICON_SIZE.sm} aria-hidden="true" />
      </button>
      {isOpen && (
        <ul className="detail-category__items">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}