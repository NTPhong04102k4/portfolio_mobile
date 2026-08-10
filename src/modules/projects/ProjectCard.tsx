import { useState } from 'react';

import type { Project } from './data/projects';
import { ProjectCardDetails } from './ProjectCardDetails';
import { ProjectCardLinks } from './ProjectCardLinks';

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

      {showDetails && <ProjectCardDetails categories={project.detailCategories} />}

      {/* Store Badges */}
      <ProjectCardLinks playStoreLink={project.playStoreLink} appLink={project.link} />
    </article>
  );
}
