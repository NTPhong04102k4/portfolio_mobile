import type { ReactNode } from 'react';

import { AiAssistantWidget } from '@/modules/ai/AiAssistantWidget';

import { Footer } from './Footer';
import { Header } from './Header';

export type SectionId = 'about' | 'projects' | 'experience' | 'blog' | 'contact';

type PageLayoutProps = {
  children: ReactNode;
  activeSection?: SectionId;
  onSelectSection?: (section: SectionId) => void;
};

export function PageLayout({ children, activeSection, onSelectSection }: PageLayoutProps) {
  return (
    <div className="portfolio-page">
      <Header activeSection={activeSection} onSelectSection={onSelectSection} />
      <main className="portfolio-main">
        <div className="portfolio-content">{children}</div>
      </main>
      <AiAssistantWidget />
      <Footer />
    </div>
  );
}