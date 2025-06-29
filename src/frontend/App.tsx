import { HashRouter, Routes, Route } from "react-router";
import { NavBar } from "@/frontend/components/navbar.tsx";
import { ShortcutList } from "@/frontend/components/shortcut-list.tsx";
import { SettingsPage } from "@/frontend/pages/settings_page.tsx";

import { ShortcutProps } from "@/frontend/types.ts";

// adding type for IPC event handlers
declare global {
  interface Window {
    electron: {
      getShortcutList: () => Promise<Record<string, ShortcutProps> | null>;
      addShortcut: (data: ShortcutProps) => Promise<{ success: boolean, message: string }>;
      deleteShortcut: (shortcutId: string) => Promise<{ success: boolean, message: string }>;
    };
  }
}

function App() {
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
