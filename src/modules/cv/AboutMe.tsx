import { FileDown, MessageCircle } from 'lucide-react';

import { CV_PDF_URL } from '@/config/assets';
import { ICON_SIZE } from '@/config/icons';
import { UserProfile } from '@/modules/user/UserProfiles';

const softSkills: string[] = [
  'Tự học và chủ động cập nhật công nghệ mới (Swift, Kotlin, Flutter)',
  'Làm việc nhóm và giao tiếp trong môi trường Agile/Scrum',
  'Chịu khó debug, kiên nhẫn xử lý vấn đề khó & bảo mật hệ thống (ForgeRock IAM, Biometric)',
];

export function AboutMe() {
  const scrollToContact = () => {
    const el = document.getElementById('contact') || document.getElementById('blog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-container">
      <UserProfile />

      <div className="hero-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <a
          href={CV_PDF_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          <FileDown size={ICON_SIZE.md} aria-hidden="true" />
          Tải CV PDF (Senior Mobile Engineer)
        </a>
        <button type="button" onClick={scrollToContact} className="btn-secondary">
          <MessageCircle size={ICON_SIZE.md} aria-hidden="true" />
          Liên hệ & Thảo luận Dự án
        </button>
      </div>

      <section className="cv-subsection cv-subsection--softskills" style={{ marginTop: '28px' }}>
        <h3>Kỹ năng mềm & Phương pháp làm việc</h3>
        <ul>
          {softSkills.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
