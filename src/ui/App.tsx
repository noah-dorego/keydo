import { NavBar } from "../components/navbar.tsx";
import { ShortcutList } from "@/components/shortcut-list.tsx";

import { Key, ShortcutProps } from "./types.ts";

// adding type for IPC event handlers
declare global {
  interface Window {
    electron: {
      addShortcut: (data: ShortcutProps) => Promise<any>;
    };
  }
}

function App() {
  const addNewShortcut = async () => {
    const data = {
      command: [Key.Y, Key.Alt],
      action: "TEST NEW SHORTCUT",
    };

    try {
      const response = await window.electron.addShortcut(data);
      console.log("Response from Electron:", response);
    } catch (error) {
      console.error("Error sending data to Electron:", error);
    }
  };

  return (
    <>
      <NavBar />
      <ShortcutList />
      <div className="card">
        <button onClick={() => addNewShortcut()}>Add test</button>
      </div>
    </>
  );
}

export default App;
