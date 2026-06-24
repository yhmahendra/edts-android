import type { Options } from '@wdio/types';
import { config as baseConfig } from '@config/wdio.conf';
import dataCapabilities from '@config/data-capabilities';
import dataConfig from '@config/data-config';

// Load .env file
import { readFileSync } from 'fs';
try {
  const env = readFileSync('.env', 'utf-8');
  for (const line of env.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0 && !process.env[key.trim()]) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
} catch {
  // .env not found — use process.env or defaults
}

const localConfig = baseConfig as Options.Testrunner & { capabilities: unknown[] };

localConfig.hostname = dataConfig.appiumHost;
localConfig.port = dataConfig.appiumPort;
localConfig.path = '/';

localConfig.capabilities = [
  {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': dataCapabilities.deviceName,
    'appium:udid': dataCapabilities.udid,
    'appium:platformVersion': dataCapabilities.platformVersion,
    'appium:appPackage': dataCapabilities.bundleId,
    'appium:appActivity': dataCapabilities.appActivity,
    'appium:noReset': true,
    'appium:newCommandTimeout': 180,
    'appium:autoGrantPermissions': true,
    'appium:ignoreHiddenApiPolicyError': true,
    'appium:disableWindowAnimation': true,
  },
];

export const config = localConfig;
