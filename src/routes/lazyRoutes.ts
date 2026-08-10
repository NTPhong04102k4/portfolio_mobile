import type { RouteId } from './paths';

/**
 * Dynamic imports for the code-split routes.
 *
 * Shared by the router and the header's hover prefetch on purpose: the module
 * registry keys off the import specifier, so hovering a nav link warms exactly
 * the chunk the router will await moments later, and the second call resolves
 * from cache instead of refetching.
 */
const ROUTE_LOADERS = {
  projects: () => import('./ProjectsPage'),
  experience: () => import('./ExperiencePage'),
  blog: () => import('./BlogPage'),
};

type PrefetchableId = keyof typeof ROUTE_LOADERS;

export const routeLoaders = ROUTE_LOADERS;

/** Ids already requested — a chunk only ever needs fetching once. */
const requested = new Set<PrefetchableId>();

/** Navigator.connection is not in lib.dom; only the field we need is declared. */
type DataSaverNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

function isPrefetchable(id: RouteId): id is PrefetchableId {
  return id in ROUTE_LOADERS;
}

/**
 * Warms a route chunk ahead of navigation. Safe to call repeatedly and on every
 * pointer event — it de-duplicates and never throws into the caller.
 *
 * Skipped entirely when the user has Data Saver on: the experience chunk is
 * ~246 kB and speculatively spending that on a metered connection for a page
 * the user may never open is not a trade we get to make for them.
 */
export function prefetchRoute(id: RouteId): void {
  if (!isPrefetchable(id) || requested.has(id)) return;

  if ((navigator as DataSaverNavigator).connection?.saveData) return;

  requested.add(id);
  // A failed prefetch is not a user-facing error: the real navigation will
  // retry and surface any genuine problem through the router's errorElement.
  void ROUTE_LOADERS[id]().catch(() => requested.delete(id));
}
