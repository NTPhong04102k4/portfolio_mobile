import type { ReactNode } from 'react';

import { useI18n } from '@/i18n/I18nContext';
import { Section } from '@/modules/layout/Section';

import { getNavItem, type RouteId } from './paths';

type RoutePageProps = {
  routeId: RouteId;
  children: ReactNode;
};

/**
 * Wraps a page in the shared `Section` shell, pulling its title and subtitle
 * from `paths.ts` so page headings stay in sync with the nav labels.
 */
export function RoutePage({ routeId, children }: RoutePageProps) {
  const { t } = useI18n();
  const { labelKey, subtitleKey } = getNavItem(routeId);

  return (
    <Section id={routeId} title={t(labelKey)} subtitle={t(subtitleKey)}>
      {children}
    </Section>
  );
}
