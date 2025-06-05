import { FaPlus } from "react-icons/fa6";
import { Button } from "./ui/button.tsx";
import { ShortcutRow } from "./shortcut-row.tsx";
import { Key, ShortcutProps } from "../frontend/types.ts";
import { useEffect, useState } from "react";

interface ShortcutListProps {
  openAddShortcutModal: () => void;
}

// Helper function to parse accelerator string to Key array
// This is a simplified parser. Robust parsing might need to handle "CmdOrCtrl" or aliases.
const parseAcceleratorToKeys = (accelerator: string): Key[] => {
  if (!accelerator) return [];
  return accelerator.split('+').map(part => {
    // Attempt to map known parts directly from Key enum values
    // This assumes accelerator parts match Key enum string values (e.g., "Ctrl", "P")
    const keyEnum = Key[part as keyof typeof Key];
    if (keyEnum) {
      return keyEnum;
    }
    // Fallback for single characters or unmapped keys - assumes Key enum includes them
    // e.g. if part is "P", Key.P should exist.
    // This might need refinement based on how Key enum is structured for non-modifier keys.
    if (part.length === 1 && Key[part.toUpperCase() as keyof typeof Key]) {
      return Key[part.toUpperCase() as keyof typeof Key]; // Try uppercase for letters
    }
    if (Key[part as keyof typeof Key]) { // Try direct match again for symbols etc.
        return Key[part as keyof typeof Key];
    }
    console.warn(`Unmapped key part in accelerator: ${part}`);
    return part as Key; // Treat as Key if unmappable - might cause issues if not a valid Key enum
  }).filter(Boolean) as Key[]; // Filter out any undefined/null if mapping fails severely
};

export function ShortcutList({ openAddShortcutModal }: ShortcutListProps) {
  const [shortcuts, setShortcuts] = useState<ShortcutProps[]>([]);

  useEffect(() => {
    async function fetchShortcuts() {
      try {
        const shortcutListObj = await window.electron.getShortcutList();
        if (shortcutListObj && typeof shortcutListObj === 'object') {
          // Cast the values to ShortcutProps[] to satisfy TypeScript
          const shortcutsArray = Object.values(shortcutListObj) as ShortcutProps[];
          setShortcuts(shortcutsArray);
        } else {
          console.error("Received invalid shortcuts data:", shortcutListObj);
          setShortcuts([]); // Set to empty if data is invalid
        }
      } catch (error) {
        console.error("Error fetching shortcuts:", error);
        setShortcuts([]); // Set to empty on error
      }
    }
    fetchShortcuts();
  }, []); // Empty dependency array means this runs once on mount

  const addNewShortcut = () => {
    openAddShortcutModal();
  };

  return (
    <div className="w-screen px-4">
      <hr className="h-2 mb-4 bg-black rounded-lg"></hr>
      {shortcuts.length === 0 && (
        <p className="text-center text-gray-500">No shortcuts configured yet. Click "New" to add one!</p>
      )}
      {shortcuts.map((shortcut) => (
        <ShortcutRow 
          key={shortcut.id} 
          keys={parseAcceleratorToKeys(shortcut.accelerator)} 
          action={shortcut.name}
        />
      ))}
      <Button
        className="w-full border-dashed border-gray-500 border-2 bg-transparent text-gray-500 hover:border-none hover:bg-black hover:text-white mt-4"
        onClick={addNewShortcut}
      >
        <FaPlus /> New
      </Button>
    </div>
  );
}
