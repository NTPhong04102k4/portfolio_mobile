import { useI18n } from '@/i18n/ThemeLanguageContext';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Nguyễn Thế Phong. {t('nav.contact')}.</p>
      </div>
    </footer>
  );
}
