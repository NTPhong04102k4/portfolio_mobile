import '@/styles/main.scss';

import { type ReactNode,useState } from 'react';

import { assertPortfolioConfig } from '@/config/portfolioModules';
import { I18nProvider, useI18n } from '@/i18n/I18nContext';
import { BlogIssues } from '@/modules/blog/BlogIssues';
import { AboutMe } from '@/modules/cv/AboutMe';
import { CvExperience } from '@/modules/cv/CvExperencies';
import { CvHobbies } from '@/modules/cv/CvHobbies';
import { CvProjects } from '@/modules/cv/Cvprojects';
import { PageLayout, type SectionId } from '@/modules/layout/PageLayout';
import { Section } from '@/modules/layout/Section';
import { ProjectsList } from '@/modules/projects/ProjectList';
import { SkillsRadar } from '@/modules/skills/SkillRadar';
import { ThemeProvider } from '@/theme/ThemeContext';

assertPortfolioConfig();

type SectionConfig = {
  id: SectionId;
  title: string;
  subtitle: string;
  render: () => ReactNode;
};

function InnerApp() {
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const { t } = useI18n();

  const sections: SectionConfig[] = [
    {
      id: 'about',
      title: t('nav.about'),
      subtitle: t('section.about.subtitle'),
      render: () => <AboutMe />,
    },
    {
      id: 'projects',
      title: t('nav.projects'),
      subtitle: t('section.projects.subtitle'),
      render: () => (
        <>
          <ProjectsList />
          <div style={{ marginTop: '32px' }}>
            <CvProjects />
          </div>
        </>
      ),
    },
    {
      id: 'experience',
      title: t('nav.experience'),
      subtitle: t('section.experience.subtitle'),
      render: () => (
        <>
          <div style={{ marginBottom: '32px' }}>
            <SkillsRadar />
          </div>
          <CvExperience />
          <CvHobbies />
        </>
      ),
    },
    {
      id: 'blog',
      title: t('nav.blog'),
      subtitle: t('section.blog.subtitle'),
      render: () => <BlogIssues />,
    },
  ];

  return (
    <PageLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {sections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          title={section.title}
          subtitle={section.subtitle}
        >
          {section.render()}
        </Section>
      ))}
    </PageLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <InnerApp />
      </I18nProvider>
    </ThemeProvider>
  );
}