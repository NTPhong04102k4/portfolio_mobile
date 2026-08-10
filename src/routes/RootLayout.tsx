import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom';

import { PageLayout } from '@/modules/layout/PageLayout';
import { RouteSkeleton } from '@/modules/layout/RouteSkeleton';

/**
 * How long a navigation must stay pending before the skeleton appears.
 *
 * Routes resolved from cache finish in a few milliseconds; showing a skeleton
 * for those would be a one-frame flash that reads as a glitch rather than as
 * feedback. Anything slower than this is a wait the user can actually perceive,
 * and that is exactly when the placeholder earns its place.
 */
const SKELETON_DELAY_MS = 120;

/**
 * Shell rendered for every route: header, footer and AI widget stay mounted
 * across navigation, only `<Outlet />` swaps out.
 *
 * The experience route pulls a ~240 kB chunk (chart.js + the syntax
 * highlighter). React Router's route-level `lazy` blocks the transition while
 * that downloads, so without this the previous page just sits there frozen with
 * no sign anything is happening.
 */
export function RootLayout() {
  const navigation = useNavigation();

  /** Identifies the in-flight navigation; null while idle. */
  const pendingKey = navigation.state === 'loading' ? navigation.location.key : null;

  /**
   * The navigation that has already outlasted the delay. Storing the key rather
   * than a boolean means a stale `true` from an earlier navigation can never
   * match the next one, so the skeleton always starts from hidden — and the
   * state is only ever set from the timer callback, never synchronously inside
   * the effect.
   */
  const [elapsedKey, setElapsedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingKey) return;

    const timer = window.setTimeout(() => setElapsedKey(pendingKey), SKELETON_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pendingKey]);

  const showSkeleton = pendingKey !== null && elapsedKey === pendingKey;

  return (
    <PageLayout>
      {showSkeleton ? <RouteSkeleton /> : <Outlet />}
      <ScrollRestoration />
    </PageLayout>
  );
}
