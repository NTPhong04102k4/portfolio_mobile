import type { Project } from './data/projects';

type ProjectCardDetailsProps = {
  categories: Project['detailCategories'];
};

export function ProjectCardDetails({ categories }: ProjectCardDetailsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="project-card__details">
      {categories.map((cat) => (
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
  );
}
