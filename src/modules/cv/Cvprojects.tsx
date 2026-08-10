import { Play } from 'lucide-react';

import { ICON_SIZE } from '@/config/icons';
import { cvV1Data } from '@/content/cv_v1.parsed';
import { MobileShowcase } from '@/modules/projects/MobileShowCase';

export function CvProjects() {
  const { project } = cvV1Data;

  return (
    <article className="cv-section cv-section--projects">
      <h3>{project.name}</h3>
      <p className="cv-section__meta">
        Nền tảng: {project.platform} • Backend: {project.backend} • Database:{' '}
        {project.database}
      </p>
      <p className="cv-section__meta">Quy mô: {project.scale}</p>
      <ul>
        {project.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {project.link && (
        <p className="cv-section__link">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="store-badge"
          >
            <Play className="store-badge__icon" size={ICON_SIZE.sm} aria-hidden="true" />
            Xem trên Google Play
          </a>
        </p>
      )}

      <MobileShowcase />
    </article>
  );
}
