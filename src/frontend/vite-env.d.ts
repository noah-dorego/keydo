/// <reference types="vite/client" />

import { ShortcutProps } from "./types.js";

type Settings = {
  notificationBannersEnabled: boolean;
  notificationSoundsEnabled: boolean;
};

declare global {
  interface Window {
    electron: {
      getShortcutList: () => Promise<Record<string, ShortcutProps> | null>;
      addShortcut: (
        data: ShortcutProps
      ) => Promise<{ success: boolean; message: string }>;
      deleteShortcut: (shortcutId: string) => Promise<{ success: boolean }>;
      playShortcutSound: () => Promise<{ success: true }>;
      onPlayShortcutSound: (callback: () => void) => void;
      getSettings: () => Promise<Settings>;
      updateSettings: (
        key: string,
        value: boolean
      ) => Promise<{ success: true }>;
    };
  }
}
