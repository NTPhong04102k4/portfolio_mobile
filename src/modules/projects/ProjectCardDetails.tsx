import { ICON_SIZE } from '@/config/icons';

import type { Project } from './data/projects';

type ProjectCardDetailsProps = {
  categories: Project['detailCategories'];
};

export function ProjectCardDetails({ categories }: ProjectCardDetailsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="project-card__details">
      {categories.map(({ title, icon: Icon, items }) => (
        <div key={title} className="project-card__detail-cat">
          <h4>
            <Icon className="project-card__detail-icon" size={ICON_SIZE.md} aria-hidden="true" />
            {title}
          </h4>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
