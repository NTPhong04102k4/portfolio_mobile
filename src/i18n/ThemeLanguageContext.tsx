import { createContext, type ReactNode,useContext, useState } from 'react';

export type Language = 'vi' | 'en';

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'portfolio_lang';

const translations: Record<string, { vi: string; en: string }> = {
  'nav.about': { vi: 'Giới thiệu', en: 'About me' },
  'nav.projects': { vi: 'Dự án', en: 'Projects' },
  'nav.experience': { vi: 'Kinh nghiệm & Học vấn', en: 'Experience & Education' },
  'nav.blog': { vi: 'Blog', en: 'Blog' },
  'nav.contact': { vi: 'Liên hệ', en: 'Contact' },

  'section.about.subtitle': {
    vi: 'Tên, định hướng, kỹ năng chính',
    en: 'Name, direction, main skills',
  },
  'section.projects.subtitle': {
    vi: 'Eatsy, SoldCar và các dự án khác',
    en: 'Eatsy, SoldCar and other projects',
  },
  'section.experience.subtitle': {
    vi: 'Tóm tắt quá trình làm việc và học tập',
    en: 'Summary of work and education',
  },
  'section.blog.subtitle': {
    vi: 'Case debug và bài học',
    en: 'Debug cases and lessons learned',
  },
  'section.contact.subtitle': {
    vi: 'Kênh liên lạc chuyên nghiệp',
    en: 'Professional contact channels',
  },
};

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === 'vi' || stored === 'en') {
        return stored;
      }
    }
    return 'vi';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const t = (key: string) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang];
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Context hook exported alongside provider
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
