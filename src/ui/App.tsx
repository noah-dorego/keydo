import { NavBar } from "../components/navbar.tsx";
import { ShortcutList } from "@/components/shortcut-list.tsx";

import { Key, ShortcutProps } from "./types.ts";

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
    <>
      <NavBar />
      <ShortcutList />
    </>
  );
}

export default App;
