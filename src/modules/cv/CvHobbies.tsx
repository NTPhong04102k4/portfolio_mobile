import { cvV1Data } from '@/content/cv_v1.parsed';

export function CvHobbies() {
  return (
    <article className="cv-section cv-section--hobbies">
      <h3>Sở thích</h3>
      <ul>
        {cvV1Data.hobbies.map((hobby) => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
    </article>
  );
}
