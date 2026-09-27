import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eldersaath.app",
  appName: "ElderSaath",
  webDir: "out",
  server: {
    url: "https://eldersaath.vercel.app",
    cleartext: true
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
