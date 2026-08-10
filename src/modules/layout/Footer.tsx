import { useI18n } from '@/i18n/I18nContext';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="portfolio-footer">
      <p>
        © {new Date().getFullYear()} Nguyễn Thế Phong. {t('nav.contact')}.
      </p>
    </footer>
  );
}
