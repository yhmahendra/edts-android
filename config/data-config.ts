export default {
  appiumHost: process.env.APPIUM_HOST ?? 'localhost',
  appiumPort: parseInt(process.env.APPIUM_PORT ?? '4723', 10),
  defaultTimeout: 15000,
  waitTimeout: 30000,
  searchKeyword: process.env.SEARCH_KEYWORD!,
};
