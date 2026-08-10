import { createBrowserRouter } from 'react-router-dom';

import { AboutPage } from './AboutPage';
import { routeLoaders } from './lazyRoutes';
import { NotFoundPage } from './NotFoundPage';
import { RootLayout } from './RootLayout';
import { RouteErrorPage } from './RouteErrorPage';

/**
 * Vite exposes its `base` option as `BASE_URL` (always with a trailing slash).
 * React Router wants it without one, so deploying under a sub-path — e.g.
 * `VITE_BASE_URL=/portfolio/` for GitHub Pages — keeps working unchanged.
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        // Landing route stays eager — lazy-loading it would only add a blank
        // frame on first paint, with nothing to gain.
        { index: true, element: <AboutPage /> },
        // Loaders come from `lazyRoutes` so the header's hover prefetch warms
        // the very same chunk these await.
        {
          path: 'projects',
          lazy: async () => {
            const { ProjectsPage } = await routeLoaders.projects();
            return { Component: ProjectsPage };
          },
        },
        {
          path: 'experience',
          lazy: async () => {
            const { ExperiencePage } = await routeLoaders.experience();
            return { Component: ExperiencePage };
          },
        },
        {
          path: 'blog',
          lazy: async () => {
            const { BlogPage } = await routeLoaders.blog();
            return { Component: BlogPage };
          },
        },
        // Catch-all sits inside the layout so a 404 still shows header/footer.
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename },
);
