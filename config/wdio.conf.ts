import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: [
    `${process.cwd()}/test/features/**/*.feature`,
  ],

  suites: {
    payment: [`${process.cwd()}/test/features/payment-virtual-account.feature`],
  },

  exclude: [],

  maxInstances: 1,

  logLevel: 'error',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [],

  framework: 'cucumber',

  reporters: [
    ['spec', { realtimeReporting: true }],
    [
      'allure',
      {
        outputDir: './reports/allure-results',
        disableWebdriverStepsReporting: true,
        useCucumberStepReporter: true,
      },
    ],
  ],

  cucumberOpts: {
    require: ['./test/steps/*.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    timeout: 300000,
    ignoreUndefinedDefinitions: false,
    retry: 0,
  },
};
