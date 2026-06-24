export default {
  udid: process.env.DEVICE_UDID!,
  deviceName: process.env.DEVICE_NAME!,
  platformVersion: process.env.ANDROID_VERSION ?? '16',
  bundleId: process.env.APP_PACKAGE ?? 'com.indomaret.klikindomaret',
  // Auto-discovered main activity (obfuscated class name)
  appActivity: process.env.APP_ACTIVITY ?? 'com.indomaret.klikindomaret/.ngsCexmFBytBw',
};
