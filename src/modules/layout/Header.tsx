import { useI18n } from '@/i18n/I18nContext';

import type { SectionId } from './PageLayout';

type HeaderProps = {
  activeSection?: SectionId;
  onSelectSection?: (section: SectionId) => void;
};

export function Header({ activeSection = 'about', onSelectSection }: HeaderProps) {
  const { t } = useI18n();

  const navItems: { id: SectionId; label: string; icon: string }[] = [
    { id: 'about', label: t('nav.about'), icon: '👤' },
    { id: 'projects', label: t('nav.projects'), icon: '💼' },
    { id: 'experience', label: t('nav.experience'), icon: '🚀' },
    { id: 'blog', label: t('nav.blog'), icon: '📝' },
  ];

  const handleNavClick = (id: SectionId) => {
    if (onSelectSection) {
      onSelectSection(id);
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="portfolio-header">
      {/* Brand & Identity */}
      <div className="portfolio-header__brand">
        <span className="portfolio-header__name">Nguyễn Thế Phong</span>
        <span className="portfolio-header__role">
          Mobile Engineer · Swift / Kotlin / Flutter / RN
        </span>
      </div>

      {/* Center Navigation Bar */}
      <nav className="portfolio-header__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`portfolio-header__nav-item ${
              activeSection === item.id ? 'is-active' : ''
            }`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-item__icon">{item.icon}</span>
            <span className="nav-item__label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Right Controls & Actions */}
      <div className="portfolio-header__right">
        <a
          href="/cv-phong-react-native.pdf"
          className="portfolio-header__cv-button"
          target="_blank"
          rel="noreferrer"
        >
          📄 CV PDF
        </a>
      </div>
    </header>
  );
}
