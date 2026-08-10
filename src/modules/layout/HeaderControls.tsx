/**
 * Theme (dark/light) and language (VI/EN) switchers.
 *
 * Currently PARKED: `Header` no longer mounts them, so this module is not part
 * of any import graph and gets tree-shaken out of the bundle. The styles
 * (`.portfolio-header__theme-toggle`, `.portfolio-header__lang-toggle`) are kept
 * in `styles/components/_header.scss` so re-enabling is a one-line change:
 * import `{ LangToggle, ThemeToggle }` in `Header` and drop them back into
 * `.portfolio-header__right`.
 *
 * The underlying providers stay active — `ThemeProvider` still applies
 * `data-theme` and `I18nProvider` still resolves labels — only the UI is gone.
 */
import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';

const LANGUAGES = [
  { id: 'vi', label: 'VI' },
  { id: 'en', label: 'EN' },
] as const;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === 'dark' ? 'Light' : 'Dark';

  return (
    <button
      type="button"
      className="portfolio-header__theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextLabel} mode`}
      title={`Switch to ${nextLabel} mode`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
}

export function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="portfolio-header__lang-toggle" role="group" aria-label="Language">
      {LANGUAGES.map((item) => (
        <button
          key={item.id}
          type="button"
          className={item.id === lang ? 'is-active' : ''}
          onClick={() => setLang(item.id)}
          aria-pressed={item.id === lang}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
