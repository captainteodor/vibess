import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load credentials from the credentials.json file
let androidCredentials = {};

try {
  const credentialsPath = join(__dirname, 'credentials.json');
  const credentialsData = readFileSync(credentialsPath, 'utf8');
  androidCredentials = JSON.parse(credentialsData).android.keystore;
} catch (error) {
  console.error('Error reading credentials.json file:', error);
}

export default ({ config }) => ({
  ...config,
  name: 'Vibe Advisor',
  slug: 'vibe-advisor',
  version: '1.0.0',
  scheme: 'com.vibe.advisor',
  jsEngine: 'hermes',
  platforms: ['android', 'web'],
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.anonymous.swiftiesandroids'
  },
  android: {
    package: 'com.vibe.advisor',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON_PATH || './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    signingConfigs: {
      release: {
        storeFile: androidCredentials.keystorePath || process.env.ANDROID_KEYSTORE_PATH || './android/app/my-release-key.jks',
        storePassword: androidCredentials.keystorePassword || process.env.ANDROID_STORE_PASSWORD || 'android',
        keyAlias: androidCredentials.keyAlias || process.env.ANDROID_KEY_ALIAS || 'androiddebugkey',
        keyPassword: androidCredentials.keyPassword || process.env.ANDROID_KEY_PASSWORD || 'android',
      },
    },
    buildTypes: {
      release: {
        signingConfig: 'release',
        minifyEnabled: true,
        proguardFiles: ['proguard-rules.pro', 'proguard-android-optimize.txt'],
        resValue: {
          'string': {
            'app_name': 'Vibe Advisor',
          },
        },
      },
    },
    permissions: [
      'INTERNET',
      'ACCESS_NETWORK_STATE',
      // Add any other required permissions
    ],
  },
  extra: {
    googleClientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    googleClientIdIos: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    googleClientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    googleClientIdExpo: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_EXPO,
    eas: {
      projectId: 'ce2860fa-1c66-4295-b020-e4bc6f8d0c24',
    },
    router: {
      origin: false,
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-dev-launcher',
      {
        launchMode: 'most-recent',
      },
    ],
    'expo-build-properties',
    'expo-secure-store',
    '@react-native-google-signin/google-signin',
  ],
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
});
