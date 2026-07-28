import { projects } from './data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsList() {
  return (
    <div className="bento-projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
