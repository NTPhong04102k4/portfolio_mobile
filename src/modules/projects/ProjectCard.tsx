import { ChevronDown, ChevronRight } from 'lucide-react';

import { ICON_SIZE } from '@/config/icons';

import type { Project } from './data/projects';
import { ProjectCardDetails } from './ProjectCardDetails';
import { ProjectCardLinks } from './ProjectCardLinks';

type ProjectCardProps = {
  project: Project;
  /**
   * Controlled by `ProjectsList` rather than local state: the grid needs to know
   * whether any card is open so it can stop forcing equal row heights.
   */
  isExpanded: boolean;
  onToggle: (projectId: string) => void;
};

export function ProjectCard({ project, isExpanded, onToggle }: ProjectCardProps) {
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
          onClick={() => onToggle(project.id)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronDown size={ICON_SIZE.sm} aria-hidden="true" />
          ) : (
            <ChevronRight size={ICON_SIZE.sm} aria-hidden="true" />
          )}
          {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết công việc'}
        </button>
      )}

      {isExpanded && <ProjectCardDetails categories={project.detailCategories} />}

      {/* Store Badges */}
      <ProjectCardLinks playStoreLink={project.playStoreLink} appLink={project.link} />
    </article>
  );
}
