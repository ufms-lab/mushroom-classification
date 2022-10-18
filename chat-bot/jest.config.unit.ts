import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['src', 'tests'],
  testRegex: '\\.unit\\.ts$',
  moduleNameMapper: {
    '@apisheet/(.*)': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/unit-coverage',
  collectCoverageFrom: ['<rootDir>/src/core/**/*.ts', '<rootDir>/src/modules/**/*.service.ts'],
}

export default config
