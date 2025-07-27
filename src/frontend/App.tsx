import { HashRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { NavBar } from "@/frontend/components/navbar.tsx";
import { ShortcutList } from "@/frontend/components/shortcut-list.tsx";
import { SettingsPage } from "@/frontend/pages/settings_page.tsx";
import { AudioPlayer } from "@/frontend/lib/audio.ts";
import { ThemeProvider } from "@/frontend/components/theme-provider.tsx";

import { TooltipProvider } from "@/frontend/components/ui/tooltip.tsx";

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
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <HashRouter>
          <TooltipProvider>
          <NavBar />
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<ShortcutList />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
          </TooltipProvider>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
