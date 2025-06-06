import { FaPlus } from "react-icons/fa6";
import { Button } from "./ui/button.tsx";
import { ShortcutRow } from "./shortcut-row.tsx";

import { Key } from "../ui/types.ts";
import { useEffect, useState } from "react";

export function ShortcutList() {
  const [shortcuts, setShortcuts] = useState([{}, {}, {}]);

  useEffect(() => {
    async function getShortcuts() {
      const shortcutList = await window.electron.getShortcuts();
      console.log(shortcutList);
    }
    getShortcuts();
  }, []);

  const addNewShortcut = async () => {
    const command = [Key.Y, Key.Alt].join("+");

    const data = {
      "id": "unique-shortcut-id",
      "name": "User-Friendly Name",
      "accelerator": command,
      "actionType": "predefinedAction",
      "actionDetails": {
        // Parameters specific to the actionType
        "param1": "value1"
      }
    };

    try {
      const response = await window.electron.addShortcut(data);
      console.log("Response from Electron:", response);
    } catch (error) {
      console.error("Error sending data to Electron:", error);
      setShortcuts([]); // temp
    }
  };

  return (
    <div className="w-screen px-4">
      <Button
        className="w-full border-dashed border-gray-500 border-2 bg-transparent text-gray-500 hover:border-none hover:bg-black hover:text-white"
        onClick={() => addNewShortcut()}
      >
        <FaPlus /> New
      </Button>
      <hr className="my-4 h-2 bg-black rounded-lg"></hr>
      {shortcuts.map(() => (
        <ShortcutRow keys={[Key.Alt, Key.Y]} action="Test"></ShortcutRow>
      ))}
    </div>
  );
}
