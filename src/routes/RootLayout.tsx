import { Outlet, ScrollRestoration } from 'react-router-dom';

import { PageLayout } from '@/modules/layout/PageLayout';

/**
 * Shell rendered for every route: header, footer and AI widget stay mounted
 * across navigation, only `<Outlet />` swaps out.
 */
export function RootLayout() {
  return (
    <PageLayout>
      <Outlet />
      <ScrollRestoration />
    </PageLayout>
  );
}
