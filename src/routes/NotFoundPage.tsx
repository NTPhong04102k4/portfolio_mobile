import { Link, useLocation } from 'react-router-dom';

import { useI18n } from '@/i18n/I18nContext';

import { ROUTES } from './paths';

export function NotFoundPage() {
  const { t } = useI18n();
  const { pathname } = useLocation();

  return (
    <div className="route-fallback">
      <p className="route-fallback__code">404</p>
      <h2 className="route-fallback__title">{t('notfound.title')}</h2>
      <p className="route-fallback__text">{t('notfound.text')}</p>
      <code className="route-fallback__path">{pathname}</code>
      <Link to={ROUTES.about} className="route-fallback__link">
        ← {t('notfound.back')}
      </Link>
    </div>
  );
}
