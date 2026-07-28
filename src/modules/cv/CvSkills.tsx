import { cvV1Data } from '@/content/cv_v1.parsed';

export function CvSkills() {
  const { skills } = cvV1Data;

  return (
    <div className="cv-section cv-section--skills">
      <SkillGroup title="📱 Phát triển Mobile" items={skills.mobile} />
      <SkillGroup title="🗂️ Quản lý State & Dữ liệu" items={skills.stateAndData} />
      <SkillGroup
        title="🔐 Tích hợp & Xác thực"
        items={skills.authAndIntegration}
      />
      <SkillGroup title="⚡ Hiệu suất & Tối ưu" items={skills.performance} />
      <SkillGroup title="🛠️ Công cụ & Quy trình" items={skills.tools} />
    </div>
  );
}

type SkillGroupProps = {
  title: string;
  items: string[];
};

function SkillGroup({ title, items }: SkillGroupProps) {
  return (
    <section className="cv-skill-group">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
