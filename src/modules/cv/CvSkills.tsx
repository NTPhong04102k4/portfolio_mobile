import { FolderKanban, ShieldCheck, Smartphone, Wrench, Zap } from 'lucide-react';

import { type AppIcon, ICON_SIZE } from '@/config/icons';
import { cvV1Data } from '@/content/cv_v1.parsed';

export function CvSkills() {
  const { skills } = cvV1Data;

  return (
    <div className="cv-section cv-section--skills">
      <SkillGroup icon={Smartphone} title="Phát triển Mobile" items={skills.mobile} />
      <SkillGroup
        icon={FolderKanban}
        title="Quản lý State & Dữ liệu"
        items={skills.stateAndData}
      />
      <SkillGroup
        icon={ShieldCheck}
        title="Tích hợp & Xác thực"
        items={skills.authAndIntegration}
      />
      <SkillGroup icon={Zap} title="Hiệu suất & Tối ưu" items={skills.performance} />
      <SkillGroup icon={Wrench} title="Công cụ & Quy trình" items={skills.tools} />
    </div>
  );
}

type SkillGroupProps = {
  icon: AppIcon;
  title: string;
  items: string[];
};

function SkillGroup({ icon: Icon, title, items }: SkillGroupProps) {
  return (
    <section className="cv-skill-group">
      <h3>
        <Icon className="cv-skill-group__icon" size={ICON_SIZE.lg} aria-hidden="true" />
        {title}
      </h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
