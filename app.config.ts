import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const bundleIdentifier = process.env.APP_VARIANT === "development" ? "com.loxx.evox.dev" : "com.loxx.evox";
  const packageName = process.env.APP_VARIANT === "development" ? "com.loxx.evox.dev" : "com.loxx.evox";
  const appName = process.env.APP_VARIANT === "development" ? "EVOX – HIIT & CrossFit Timer (Dev)" : "EVOX – HIIT & CrossFit Timer";

  return {
    ...config,
    name: appName,
    slug: "evox",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/images/icon.png",
    scheme: "evoxapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#000000"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: packageName
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-screen-orientation",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "8bd028f1-37f4-4948-9431-4adb881d45bb"
      }
    },
    owner: "loxx",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/8bd028f1-37f4-4948-9431-4adb881d45bb"
    }
  }
};
