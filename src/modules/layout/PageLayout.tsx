import type { ReactNode } from 'react';

import { AiAssistantWidget } from '@/modules/ai/AiAssistantWidget';

import { Footer } from './Footer';
import { Header } from './Header';

type PageLayoutProps = {
  children: ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="portfolio-page">
      <Header />
      <main className="portfolio-main">
        <div className="portfolio-content">{children}</div>
      </main>
      <AiAssistantWidget />
      <Footer />
    </div>
  );
}
