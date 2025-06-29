import React, { useState } from 'react';
import { Button } from '@/frontend/components/ui/button.tsx';
import { Input } from '@/frontend/components/ui/input.tsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/frontend/components/ui/dialog.tsx';
import { Card, CardContent} from '@/frontend/components/ui/card.tsx';
import { FileText, Terminal, Lightbulb, FolderOpen, AlertTriangle, Hash, Type, Parentheses, Clipboard } from 'lucide-react';
import { Key } from '@/frontend/types.ts'; 
import { ShortcutInput } from '@/frontend/components/shortcut-input.tsx';

interface ActionType {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface TextManipulationType {
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

const textManipulationTypes: TextManipulationType[] = [
  { id: 'wordCount', name: 'Word Count', icon: Hash },
  { id: 'changeCase', name: 'Change Case', icon: Type },
  { id: 'wrapText', name: 'Wrap Text', icon: Parentheses },
  { id: 'pasteText', name: 'Paste Text', icon: Clipboard },
];

interface AddShortcutModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onShortcutAdded: () => void;
}

// Local ShortcutKey interface - ensure it matches the one in ShortcutInput if not importing
// Or import from ShortcutInput: import { ShortcutKey } from '@/components/shortcut-setter.tsx';
// For now, keeping it local but ensuring it allows nulls as per ShortcutInput
interface LocalShortcutKey {
  modifier?: (Key | null)[]; 
  key: Key | null;
}

export function AddShortcutModal({ isOpen, onOpenChange, onShortcutAdded }: AddShortcutModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActionType, setSelectedActionType] = useState<string>("");
  const [selectedTextManipulationType, setSelectedTextManipulationType] = useState<string>("");
  const [scriptPath, setScriptPath] = useState('');
  const [shortcutName, setShortcutName] = useState('');
  // Ensure initial state matches the updated ShortcutKey allowing nulls
  const [definedShortcut, setDefinedShortcut] = useState<LocalShortcutKey | null>(
    { modifier: [Key.Ctrl, Key.Shift], key: Key.P } 
  );

  const handleActionTypeSelect = (actionTypeId: string) => {
    setSelectedActionType(actionTypeId);
  };

  const handleTextManipulationTypeSelect = (textManipulationTypeId: string) => {
    setSelectedTextManipulationType(textManipulationTypeId);
  };

  const handleNext = () => {
    // Add validation for definedShortcut if needed, e.g., ensure main key is set
    if (currentStep === 2 && selectedActionType === 'script') {
        if (!definedShortcut || !definedShortcut.key) {
            alert('Please define a complete shortcut (at least a main key).');
            return;
        }
        if (!scriptPath.trim()) {
            alert('Please enter a script path.');
            return;
        }
    }
    if (currentStep < 3) { 
        setCurrentStep(currentStep + 1);
    } else {
      let actionDetails = {};
      switch (selectedActionType) {
        case 'text':
          break;
        case 'file':
          break;
        case 'script':
          actionDetails = {
            scriptPath: scriptPath,
          };
          break;
        case 'ai':
          break;
        default:
          break;
      }
        // User is on the final step (currentStep === 3)
        const shortcutData = {
          id: Date.now().toString(), // Generate a unique ID
          name: shortcutName,
          accelerator: "Ctrl+Alt+P", // Placeholder accelerator
          actionType: selectedActionType,
          actionDetails: actionDetails,
        };
        
        // Assuming window.electron.addShortcut is exposed via preload script
        if (window.electron && typeof window.electron.addShortcut === 'function') {
          window.electron.addShortcut(shortcutData).then(() => {
            onShortcutAdded();
          });
        } else {
          console.error('addShortcut function not found on window.electron. Ensure it is exposed via preload script.');
          // Fallback or error handling
        }
        
        console.log('Submitting shortcut:', shortcutData);
        handleCancel(); 
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setSelectedActionType("");
    setSelectedTextManipulationType("");
    setCurrentStep(1);
    setScriptPath('');
    setShortcutName('');
    // Reset definedShortcut to initial or a default empty state if desired
    setDefinedShortcut({ modifier: [Key.Ctrl, Key.Shift], key: Key.P }); // Or set to null / empty structure
    onOpenChange(false);
  };

  const getActionName = () => {
    return actionTypes.find(at => at.id === selectedActionType)?.name || 'Selected Action';
  };

  const renderActionConfig = () => {
    switch (selectedActionType) {
      case 'text':
        return (
          <>
            <h3 className="text-md font-medium">Choose Text Manipulation Type</h3>
            <h6 className="mb-4 text-sm text-muted-foreground">
              Select the type of text manipulation this shortcut will perform.
            </h6>
            <Card className="p-2 mb-4 bg-yellow-500/10 border-yellow-500">
                <p className='font-medium'>
                ⚠️ NOTE: Currently, text manipulation is only performed on copied text.
                </p>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              {textManipulationTypes.map((textManipulation) => (
                <Button
                  key={textManipulation.id}
                  variant={selectedTextManipulationType === textManipulation.id ? 'default' : 'outline'}
                  onClick={() => handleTextManipulationTypeSelect(textManipulation.id)}
                  className="flex flex-col items-center justify-center h-24 p-4"
                >
                  <textManipulation.icon className="w-8 h-8 mb-2" />
                  <span>{textManipulation.name}</span>
                </Button>
              ))}
            </div>
          </>
        )
      case 'script':
        return (
          <>
            <h3 className="text-md font-medium">Set Script Path</h3>
            <h6 className="mb-2 text-sm text-muted-foreground">Set the path to your script.</h6>
            <Input 
                type="text" 
                id="scriptPath" 
                value={scriptPath}
                onChange={(e) => setScriptPath(e.target.value)}
                placeholder="Enter absolute path (/path/to/your/script or C:\path\to\your\script)"
              />
            <h6 className="my-1 text-xs text-muted-foreground">Accepted file types: .exe, .bat, .sh, .py, .js, .ts</h6>
          </>
        )
      default:
        return (
          <div className="py-4 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-3" />
            <p className="text-lg font-semibold">Configuration for "{getActionName()}" is not yet implemented.</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80%] max-w-[800px]" onEscapeKeyDown={(event) => { event.preventDefault(); } }>
        <DialogHeader>
          <DialogTitle>
            Add Shortcut
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div>
            <h3 className="text-md font-medium">Choose Action Type</h3>
            <h6 className="mb-4 text-sm text-muted-foreground">
              Select the type of action this shortcut will perform.
            </h6>
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

        {currentStep === 2 && (
          <div>
            {renderActionConfig()}
          </div>
        )}
        
        {currentStep === 2 && selectedActionType !== 'script' && selectedActionType !== 'text' && selectedActionType !== null && (
            <div className="py-4 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mb-3" />
                <p className="text-lg font-semibold">Configuration for "{getActionName()}" is not yet implemented.</p>
                <p className="text-sm text-muted-foreground">Please go back and select a different action type or wait for future updates.</p>
            </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className='mb-4'>
              <h4 className="text-sm font-medium mb-2">Enter Shortcut Name</h4>
              <Input 
                type="text" 
                id="shortcutName" 
                value={shortcutName}
                onChange={(e) => setShortcutName(e.target.value)}
                placeholder="Enter shortcut name"
              />
            </div>
            <ShortcutInput shortcut={definedShortcut} setShortcut={setDefinedShortcut} />
            
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          <Button onClick={handleNext} disabled={currentStep === 1 && !selectedActionType || (currentStep === 2 && selectedActionType === 'text' && !selectedTextManipulationType)}>
            {currentStep === 3 ? 'Finish' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 