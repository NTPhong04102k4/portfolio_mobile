import config from '../../portfolio.config.json';

export type PortfolioModuleId = 'user' | 'cv' | 'projects' | 'layout';

type PortfolioConfig = {
  cvVersion: string;
  structureVersion: string;
  modules: PortfolioModuleId[];
  contentFiles: {
    rawCv: string;
    parsedCv: string;
  };
};

const typedConfig = config as PortfolioConfig;

export function assertPortfolioConfig() {
  if (typedConfig.cvVersion !== 'CV_V1') {
    throw new Error(
      `cvVersion mismatch. Expected "CV_V1" but got "${typedConfig.cvVersion}".`,
    );
  }

  if (typedConfig.structureVersion !== 'PROJECT_STRUCTURE_V1') {
    throw new Error(
      `structureVersion mismatch. Expected "PROJECT_STRUCTURE_V1" but got "${typedConfig.structureVersion}".`,
    );
  }

  const requiredModules: PortfolioModuleId[] = [
    'user',
    'cv',
    'projects',
    'layout',
  ];

  for (const moduleId of requiredModules) {
    if (!typedConfig.modules.includes(moduleId)) {
      throw new Error(
        `Missing required module "${moduleId}" in portfolio.config.json.`,
      );
    }
  }

  return typedConfig;
}
