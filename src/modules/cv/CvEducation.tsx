import { cvV1Data } from '@/content/cv_v1.parsed';

export function CvEducation() {
  return (
    <article className="cv-section cv-section--education">
      <h3>Học vấn</h3>
      <p>{cvV1Data.education}</p>
    </article>
  );
}
