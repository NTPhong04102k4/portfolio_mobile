import { CvProjects } from '@/modules/cv/Cvprojects';
import { ProjectsList } from '@/modules/projects/ProjectList';

import { RoutePage } from './RoutePage';

export function ProjectsPage() {
  return (
    <RoutePage routeId="projects">
      <ProjectsList />
      <div className="route-block-gap">
        <CvProjects />
      </div>
    </RoutePage>
  );
}
