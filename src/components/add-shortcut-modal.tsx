import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { FileText, Terminal, Lightbulb, FolderOpen } from 'lucide-react'; // Placeholder icons

interface ActionType {
  id: string;
  name: string;
  icon: React.ElementType;
}

const actionTypes: ActionType[] = [
  { id: 'text', name: 'Text Manipulation', icon: FileText },
  { id: 'file', name: 'File System', icon: FolderOpen },
  { id: 'script', name: 'Run Script', icon: Terminal },
  { id: 'ai', name: 'AI Action', icon: Lightbulb },
];

interface AddShortcutModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddShortcutModal({ isOpen, onOpenChange }: AddShortcutModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);

  const handleActionTypeSelect = (actionTypeId: string) => {
    setSelectedActionType(actionTypeId);
  };

  const handleNext = () => {
    if (selectedActionType) {
      setCurrentStep(currentStep + 1);
      // In a real scenario, you'd move to the next step of the modal
      console.log('Selected action type:', selectedActionType);
      console.log('Moving to step:', currentStep + 1);
    }
  };

  const handleCancel = () => {
    setSelectedActionType(null);
    setCurrentStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80%] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Shortcut - Step {currentStep}</DialogTitle>
          {currentStep === 1 && (
            <DialogDescription>
              Select the type of action this shortcut will perform.
            </DialogDescription>
          )}
        </DialogHeader>

        {currentStep === 1 && (
          <div className="py-4">
            <h3 className="mb-4 text-lg font-medium">Choose Action Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {actionTypes.map((action) => (
                <Button
                  key={action.id}
                  variant={selectedActionType === action.id ? 'default' : 'outline'}
                  onClick={() => handleActionTypeSelect(action.id)}
                  className="flex flex-col items-center justify-center h-24 p-4"
                >
                  <action.icon className="w-8 h-8 mb-2" />
                  <span>{action.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for Step 2 and 3 content */}
        {currentStep === 2 && (
          <div className="py-4">
            <p>Step 2: Configure Action (Not Implemented)</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="py-4">
            <p>Step 3: Review and Save (Not Implemented)</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {currentStep === 1 && (
            <Button onClick={handleNext} disabled={!selectedActionType}>
              Next
            </Button>
          )}
          {/* Add Next/Previous buttons for other steps as needed */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 