import { useCallback, useState } from 'react';

import { projects } from './data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsList() {
  /**
   * Which cards have their details open. Held here rather than inside each card
   * because the grid itself needs the answer: while every card is collapsed the
   * row stretches them to a shared height, but as soon as one expands that would
   * drag its sibling along with it — so the grid switches to content-sized rows.
   */
  const [openIds, setOpenIds] = useState<string[]>([]);

  const handleToggle = useCallback((projectId: string) => {
    setOpenIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  }, []);

  const anyOpen = openIds.length > 0;

  return (
    <div className={`bento-projects-grid${anyOpen ? ' bento-projects-grid--expanded' : ''}`}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isExpanded={openIds.includes(project.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
