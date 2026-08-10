import { lazy, Suspense } from 'react';

import { CvExperience } from '@/modules/cv/CvExperencies';
import { CvHobbies } from '@/modules/cv/CvHobbies';
import { SkillsRadarSkeleton } from '@/modules/skills/SkillRadarSkeleton';

import { RoutePage } from './RoutePage';

/**
 * chart.js + react-chartjs-2 are the bulk of this route's weight and only serve
 * one panel, so they get their own chunk. Splitting them out lets the written
 * experience content paint while the charting library is still downloading.
 *
 * `SkillsRadar` is a named export, hence the mapping to `default` that
 * `React.lazy` requires.
 */
const SkillsRadar = lazy(() =>
  import('@/modules/skills/SkillRadar').then((module) => ({
    default: module.SkillsRadar,
  })),
);

export function ExperiencePage() {
  return (
    <RoutePage routeId="experience">
      <div className="route-block-gap route-block-gap--bottom">
        <Suspense fallback={<SkillsRadarSkeleton />}>
          <SkillsRadar />
        </Suspense>
      </div>
      <CvExperience />
      <CvHobbies />
    </RoutePage>
  );
}
