# Klik Indomaret Automation

Android UI automation for the Klik Indomaret app — Virtual Account payment flow.

**Stack:** TypeScript · WebdriverIO 9 · Appium 2 · Cucumber · Bun

---

## 1. ADB Wireless Connection (Real Device)

> Required for every machine that runs the tests. USB is not needed once pairing is done.

### Enable on the device

1. Go to **Settings → Developer Options**
2. Enable **Wireless debugging**
3. Tap **Pair device with pairing code** — note the **IP address**, **port**, and **pairing code**

### Pair and connect from your machine

```bash
# Pair once (use the pairing port shown on the device, not the connection port)
adb pair <device-ip>:<pairing-port>
# Enter the pairing code when prompted

# Connect (use the connection port shown under "Wireless debugging")
adb connect <device-ip>:<connection-port>

# Verify
adb devices -l
```

### Get the UDID for .env

The UDID is the full string shown by `adb devices -l`, e.g.:

```
List of devices attached
adb-XXXXXXXXXXXX-XXXXXX._adb-tls-connect._tcp   device
```

Copy the entire identifier (including `adb-` prefix) into `DEVICE_UDID` in your `.env`:

```env
DEVICE_UDID=adb-XXXXXXXXXXXX-XXXXXX._adb-tls-connect._tcp
```

### Things to keep in mind

- **Stay on the same Wi-Fi network** as your machine — the connection drops if you switch networks.
- **Keep Developer Options → Wireless debugging ON** — it resets on some devices after reboot.
- If `adb devices` shows `unauthorized`, re-pair from scratch.
- `noReset: true` is set in capabilities — the app session is preserved between runs, so you don't need to log in again on every run as long as the session is alive.

---

## 2. Contributing

### Prerequisites

- [Bun](https://bun.sh) installed
- [Appium 2](https://appium.io) installed globally (`npm install -g appium`)
- UiAutomator2 driver: `appium driver install uiautomator2`
- Android SDK / ADB available in your `PATH`
- A real Android device connected via ADB over Wi-Fi (see section 1)

### Setup

```bash
# Clone the repository
git clone https://github.com/yhmahendra/edts-android.git
cd edts-android

# Install dependencies
bun install

# Copy and fill in your environment
cp .env.example .env
```

Fill in `.env` — every key is required:

| Key | How to get the value |
|---|---|
| `DEVICE_UDID` | `adb devices -l` |
| `DEVICE_NAME` | Device model name (e.g. `V2352`) |
| `ANDROID_VERSION` | `adb shell getprop ro.build.version.release` |
| `APP_PACKAGE` | `adb shell pm list packages \| grep indomaret` |
| `APPIUM_HOST` | `localhost` unless running Appium remotely |
| `APPIUM_PORT` | `4723` (Appium default) |
| `USER_PHONE` | Test account phone number |
| `USER_PASSWORD` | Test account password |
| `SEARCH_KEYWORD` | Product to search for (e.g. `Indomie Goreng`) |

### Start Appium

```bash
appium
```

### Run the tests

```bash
# Run all tests
bun test

# Run only @Smoke tagged scenarios
bun smoke

# Type-check without running
bun run type-check
```

### Generate Allure report

```bash
bun report
```

### Project structure

```
config/         Appium capabilities and WDIO config
test/
  features/     Cucumber .feature files
  steps/        Step definitions
  pages/        Page Object Model — one file per screen
  support/      Base actions, price calculator, shared data
```

### Adding a new test

1. Add a `.feature` file under `test/features/`
2. Add step definitions under `test/steps/`
3. Add or extend a page object under `test/pages/` — extend `BasePage` and use `this.actions` for all interactions
4. Run `bun run type-check` before pushing

### Locating elements

Resource IDs in this app are obfuscated (e.g. `rid=ce7`). To find elements:

```bash
adb shell uiautomator dump /sdcard/dump.xml
adb pull /sdcard/dump.xml .
# Open dump.xml and search for the text or resource-id of the element
```
