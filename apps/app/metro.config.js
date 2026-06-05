const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/**
 * pnpm 모노레포에서 Metro가 루트 node_modules와 모든 워크스페이스를 탐색하도록 설정
 * https://reactnative.dev/docs/metro
 */
const defaultConfig = getDefaultConfig(__dirname);

// react-native-gifted-charts, gifted-charts-core 는 dist/index.js 가 ESM export 구문을 사용해서
// Metro 기본 transformIgnorePatterns 에서 제외해야 Babel 이 CJS 로 변환해줌
const { transformIgnorePatterns = [] } = defaultConfig.transformer ?? {};
const ESM_PACKAGES = [
  'react-native-gifted-charts',
  'gifted-charts-core',
];
const esmPattern = ESM_PACKAGES.join('|');
const filteredIgnore = transformIgnorePatterns.filter(
  (p) => typeof p === 'string' && !p.includes('node_modules'),
);

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
  transformer: {
    ...defaultConfig.transformer,
    transformIgnorePatterns: [
      ...filteredIgnore,
      `node_modules/(?!(${esmPattern}|@react-native|react-native)/)`,
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
