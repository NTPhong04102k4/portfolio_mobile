import { useState } from 'react';
import type { Project } from './data/projects';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <article
      className={`project-card${project.highlight ? ' project-card--highlight' : ''}`}
    >
      <div className="project-card__role-bar">
        <span className="project-card__role">{project.role}</span>
        <span className="project-card__period">{project.period}</span>
      </div>

      <h3 className="project-card__title">{project.name}</h3>
      <p className="project-card__description">{project.description}</p>

      <ul className="project-card__tech">
        {project.techStack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      {/* Detail Categories Toggle */}
      {project.detailCategories.length > 0 && (
        <button
          type="button"
          className="project-card__details-toggle"
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? '▾ Ẩn chi tiết' : '▸ Xem chi tiết công việc'}
        </button>
      )}

      {showDetails && (
        <div className="project-card__details">
          {project.detailCategories.map((cat) => (
            <div key={cat.title} className="project-card__detail-cat">
              <h4>
                <span className="project-card__detail-icon">{cat.icon}</span>
                {cat.title}
              </h4>
              <ul>
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Store Badges */}
      <div className="project-card__links">
        {project.playStoreLink && (
          <a
            href={project.playStoreLink}
            target="_blank"
            rel="noreferrer"
            className="store-badge"
          >
            <span className="store-badge__icon">▶</span>
            Google Play
          </a>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="store-badge store-badge--secondary"
          >
            Xem ứng dụng
          </a>
        )}
      </div>
    </article>
  );
}
