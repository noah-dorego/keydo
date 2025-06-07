import { Key } from "@/frontend/types.ts";
import { Card } from "./ui/card.tsx";
import { KeyIcon } from "./key-icon.tsx";
import React, { useState } from "react";
import { Button } from "./ui/button.tsx";
import { FaTrash } from "react-icons/fa";
import { ConfirmModal } from "./confirm-modal.tsx";

type ShortcutRowProps = {
  id: string;
  keys: Key[];
  action: string;
  onDelete: () => void;
};

export function ShortcutRow({ id, keys, action, onDelete }: ShortcutRowProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleDelete = async () => {
    if (window.electron && typeof window.electron.deleteShortcut === "function") {
      const result = await window.electron.deleteShortcut(id);
      if (result.success) {
        onDelete();
      } else {
        // Handle error, maybe show a notification
        console.error("Failed to delete shortcut:", result.message);
      }
    }
  };

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center p-2">
          <div className="flex items-center gap-2">
            {keys.map((key, index) => (
              <React.Fragment key={index}>
                <KeyIcon>{key}</KeyIcon>
                {index < keys.length - 1 && " + "}
              </React.Fragment>
            ))}
          </div>
          <div className="ml-4">{action}</div>
          <div className="ml-auto">
            <Button variant="destructive" size="icon" onClick={() => setIsConfirmModalOpen(true)}>
              <FaTrash size={20} color="white" />
            </Button>
          </div>
        </div>
      </Card>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={handleDelete}
        title={`Delete Shortcut: ${action}`}
        action="delete this shortcut"
        buttonText="Delete"
        buttonVariant="destructive"
      />
    </>
  );
}
