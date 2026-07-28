import { cvV1Data } from '@/content/cv_v1.parsed';

export function CvGoals() {
  const { goals } = cvV1Data;

  return (
    <article className="cv-section cv-section--goals">
      <h3>Mục tiêu</h3>
      <div className="cv-goals">
        <section className="cv-goal">
          <h4>Ngắn hạn (1–2 năm)</h4>
          <p>{goals.shortTerm}</p>
        </section>
        <section className="cv-goal">
          <h4>Dài hạn (3–5 năm)</h4>
          <p>{goals.longTerm}</p>
        </section>
      </div>
    </article>
  );
}
