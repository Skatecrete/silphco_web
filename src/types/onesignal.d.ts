// src/types/onesignal.d.ts

interface OneSignalUser {
  pushSubscription: {
    id: string | null;
    token: string | null;
  };
}

interface OneSignalNotifications {
  requestPermission: (options?: { force?: boolean }) => Promise<boolean>;
}

interface OneSignal {
  init: (options: {
    appId: string;
    safari_web_id?: string;
    allowLocalhostAsSecureOrigin?: boolean;
  }) => Promise<void>;
  Notifications: OneSignalNotifications;
  User: OneSignalUser;
}

declare global {
  interface Window {
    OneSignal: OneSignal;
    OneSignalDeferred: Array<(OneSignal: OneSignal) => void>;
  }
}

export {};