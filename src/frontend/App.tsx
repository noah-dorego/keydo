import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { NavBar } from "../components/navbar.tsx";
import { ShortcutList } from "@/components/shortcut-list.tsx";
import { SettingsPage } from "../pages/settings_page.tsx";
import { AddShortcutModal } from "@/components/add-shortcut-modal.tsx";

import { ShortcutProps } from "./types.ts";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddShortcutModal = () => {
    setIsAddModalOpen(true);
  };

  return (
    <BrowserRouter>
      <NavBar openAddShortcutModal={handleOpenAddShortcutModal} />
      <Routes>
        <Route path="/" element={<ShortcutList openAddShortcutModal={handleOpenAddShortcutModal} />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <AddShortcutModal 
        isOpen={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </BrowserRouter>
  );
}

export default App;
