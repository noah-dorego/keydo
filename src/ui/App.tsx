import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "../components/navbar.tsx";
import { ShortcutList } from "@/components/shortcut-list.tsx";
import { SettingsPage } from "../pages/settings_page.tsx";

import { ShortcutProps } from "./types.ts";

// adding type for IPC event handlers
declare global {
  interface Window {
    electron: {
      getShortcuts: () => Promise<any>;
      addShortcut: (data: ShortcutProps) => Promise<any>;
    };
  }
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ShortcutList />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
