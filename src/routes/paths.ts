/**
 * Single source of truth for routing.
 *
 * Both the router (`routes/index.tsx`) and the header nav (`modules/layout/Header`)
 * read from here, so a route and its nav entry can never drift apart.
 */

export const ROUTES = {
  about: '/',
  projects: '/projects',
  experience: '/experience',
  blog: '/blog',
} as const;

export type RouteId = keyof typeof ROUTES;

export type NavItem = {
  id: RouteId;
  path: (typeof ROUTES)[RouteId];
  /** i18n key for the nav label — also used as the page heading */
  labelKey: string;
  /** i18n key for the sub-heading shown under the page title */
  subtitleKey: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'about',
    path: ROUTES.about,
    labelKey: 'nav.about',
    subtitleKey: 'section.about.subtitle',
    icon: '👤',
  },
  {
    id: 'projects',
    path: ROUTES.projects,
    labelKey: 'nav.projects',
    subtitleKey: 'section.projects.subtitle',
    icon: '💼',
  },
  {
    id: 'experience',
    path: ROUTES.experience,
    labelKey: 'nav.experience',
    subtitleKey: 'section.experience.subtitle',
    icon: '🚀',
  },
  {
    id: 'blog',
    path: ROUTES.blog,
    labelKey: 'nav.blog',
    subtitleKey: 'section.blog.subtitle',
    icon: '📝',
  },
];

export function getNavItem(id: RouteId): NavItem {
  const item = NAV_ITEMS.find((navItem) => navItem.id === id);
  if (!item) {
    throw new Error(`Unknown route id "${id}".`);
  }
  return item;
}
