import { Play } from 'lucide-react';

import { ICON_SIZE } from '@/config/icons';

type ProjectCardLinksProps = {
  playStoreLink?: string;
  appLink?: string;
};

export function ProjectCardLinks({ playStoreLink, appLink }: ProjectCardLinksProps) {
  if (!playStoreLink && !appLink) return null;

  return (
    <div className="project-card__links">
      {playStoreLink && (
        <a
          href={playStoreLink}
          target="_blank"
          rel="noreferrer"
          className="store-badge"
        >
          <Play className="store-badge__icon" size={ICON_SIZE.sm} aria-hidden="true" />
          Google Play
        </a>
      )}
      {appLink && (
        <a
          href={appLink}
          target="_blank"
          rel="noreferrer"
          className="store-badge store-badge--secondary"
        >
          Xem ứng dụng
        </a>
      )}
    </div>
  );
}
