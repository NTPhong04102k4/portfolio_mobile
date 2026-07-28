import { cvV1Data } from '@/content/cv_v1.parsed';

export function UserProfile() {
  return (
    <div className="user-profile">
      <div className="user-profile__status-badge">
        <span className="pulse-dot" />
        <span>Sẵn sàng cho vị trí Senior Mobile Engineer</span>
      </div>

      <h1 className="user-profile__title">
        Nguyễn Thế Phong <span className="user-profile__role-tag">Mobile Engineer</span>
      </h1>

      <p className="user-profile__meta">
        📍 {cvV1Data.profile.location} • 🏢 {cvV1Data.profile.company}
      </p>

      <p className="user-profile__intro">{cvV1Data.intro}</p>
    </div>
  );
}