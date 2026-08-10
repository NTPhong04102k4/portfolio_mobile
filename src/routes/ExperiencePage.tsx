import { CvExperience } from '@/modules/cv/CvExperencies';
import { CvHobbies } from '@/modules/cv/CvHobbies';
import { SkillsRadar } from '@/modules/skills/SkillRadar';

import { RoutePage } from './RoutePage';

export function ExperiencePage() {
  return (
    <RoutePage routeId="experience">
      <div className="route-block-gap route-block-gap--bottom">
        <SkillsRadar />
      </div>
      <CvExperience />
      <CvHobbies />
    </RoutePage>
  );
}
