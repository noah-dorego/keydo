import { FaPlus } from "react-icons/fa6";
import { Button } from "./ui/button.tsx";
import { ShortcutRow } from "./shortcut-row.tsx";
import { Key, ShortcutProps } from "@/frontend/types.ts";
import { useEffect, useState } from "react";
import { AddShortcutModal } from "./add-shortcut-modal.tsx";

// Helper function to parse accelerator string to Key array
// This is a simplified parser. Robust parsing might need to handle "CmdOrCtrl" or aliases.
const parseAcceleratorToKeys = (accelerator: string): Key[] => {
  if (!accelerator) return [];
  return accelerator
    .split("+")
    .map((part) => {
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
      if (Key[part as keyof typeof Key]) {
        // Try direct match again for symbols etc.
        return Key[part as keyof typeof Key];
      }
      console.warn(`Unmapped key part in accelerator: ${part}`);
      return part as Key; // Treat as Key if unmappable - might cause issues if not a valid Key enum
    })
    .filter(Boolean) as Key[]; // Filter out any undefined/null if mapping fails severely
};

export function ShortcutList() {
  const [shortcuts, setShortcuts] = useState<ShortcutProps[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchShortcuts = async () => {
    try {
      const shortcutListObj = await window.electron.getShortcutList();
      if (shortcutListObj && typeof shortcutListObj === "object") {
        const shortcutsArray = Object.values(
          shortcutListObj
        ) as ShortcutProps[];
        setShortcuts(shortcutsArray);
      } else {
        console.error("Received invalid shortcuts data:", shortcutListObj);
        setShortcuts([]);
      }
    } catch (error) {
      console.error("Error fetching shortcuts:", error);
      setShortcuts([]);
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const handleShortcutDeleted = () => {
    fetchShortcuts();
  };

  const handleShortcutAdded = () => {
    fetchShortcuts();
    setIsAddModalOpen(false); // Close modal on successful add
  };

  const openAddShortcutModal = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-4 bg-gradient-to-b from-white via-white/95 to-white/80 backdrop-blur-sm sticky top-0 z-10">
        <hr className="h-2 mb-4 bg-black rounded-lg"></hr>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Shortcuts</h1>
          <button
            className="rounded-full bg-black w-8 h-8 flex justify-center items-center"
            title="Add New Shortcut"
            aria-label="Add New Shortcut"
            onClick={openAddShortcutModal}
          >
            <FaPlus size={16} color="white" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 -mt-2 pt-2">
        {shortcuts.length === 0 && (
          <p className="text-center text-gray-500">
            No shortcuts configured yet. Click "New" to get started!
          </p>
        )}
        {shortcuts.map((shortcut) => (
          <ShortcutRow
            key={shortcut.id}
            id={shortcut.id}
            keys={parseAcceleratorToKeys(shortcut.accelerator)}
            action={shortcut.name}
            onDelete={handleShortcutDeleted}
          />
        ))}
        <Button
          className="w-full border-dashed border-gray-500 border-2 bg-transparent text-gray-500 hover:border-none hover:bg-black hover:text-white mt-4 mb-4"
          onClick={openAddShortcutModal}
        >
          <FaPlus /> New
        </Button>
      </div>
      
      <AddShortcutModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onShortcutAdded={handleShortcutAdded}
      />
    </div>
  );
}
