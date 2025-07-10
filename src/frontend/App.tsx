import { HashRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { NavBar } from "@/frontend/components/navbar.tsx";
import { ShortcutList } from "@/frontend/components/shortcut-list.tsx";
import { SettingsPage } from "@/frontend/pages/settings_page.tsx";
import { AudioPlayer } from "@/frontend/lib/audio.ts";

import { ShortcutProps } from "@/frontend/types.ts";

// adding type for IPC event handlers
declare global {
  interface Window {
    electron: {
      getShortcutList: () => Promise<Record<string, ShortcutProps> | null>;
      addShortcut: (data: ShortcutProps) => Promise<{ success: boolean, message: string }>;
      deleteShortcut: (shortcutId: string) => Promise<{ success: boolean, message: string }>;
      playShortcutSound: () => Promise<{ success: boolean }>;
      onPlayShortcutSound: (callback: () => void) => void;
    };
  }
}

function App() {
  useEffect(() => {
    // Set up IPC listener for playing shortcut sounds
    if (window.electron?.onPlayShortcutSound) {
      window.electron.onPlayShortcutSound(() => {
        AudioPlayer.playShortcutSound();
      });
    }
  }, []);

  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ShortcutList />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
