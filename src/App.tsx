import '@/styles/main.scss';

import { RouterProvider } from 'react-router-dom';

import { assertPortfolioConfig } from '@/config/portfolioModules';
import { I18nProvider } from '@/i18n/I18nContext';
import { router } from '@/routes';
import { ThemeProvider } from '@/theme/ThemeContext';

assertPortfolioConfig();

export default function App() {
  return (
    // Providers wrap the router, not the other way round, so theme and
    // language survive navigation instead of remounting per route.
    <ThemeProvider>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </ThemeProvider>
  );
}
