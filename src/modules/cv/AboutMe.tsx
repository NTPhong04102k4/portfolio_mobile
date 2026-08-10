import { FileDown } from 'lucide-react';

import { CV_PDF_URL } from '@/config/assets';
import { ICON_SIZE } from '@/config/icons';
import { UserProfile } from '@/modules/user/UserProfiles';

import { ContactChannels } from './ContactChannels';

const softSkills: string[] = [
  'Tự học và chủ động cập nhật công nghệ mới (Swift, Kotlin, Flutter)',
  'Làm việc nhóm và giao tiếp trong môi trường Agile/Scrum',
  'Chịu khó debug, kiên nhẫn xử lý vấn đề khó & bảo mật hệ thống (ForgeRock IAM, Biometric)',
];

export function AboutMe() {
  return (
    <div className="hero-container">
      <UserProfile />

      <div className="hero-actions">
        <a href={CV_PDF_URL} target="_blank" rel="noreferrer" className="btn-primary">
          <FileDown size={ICON_SIZE.md} aria-hidden="true" />
          Tải CV PDF (Senior Mobile Engineer)
        </a>
      </div>

      <ContactChannels />

      <section className="cv-subsection cv-subsection--softskills">
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
