import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { FileText, Terminal, Lightbulb, FolderOpen, AlertTriangle } from 'lucide-react'; // Placeholder icons
// Assuming KeyIcon is a default import, adjust if it's a named import
import { KeyIcon } from '@/components/key-icon.tsx'; // Corrected: Named import
// Assuming Key is an enum or type, adjust path as necessary
import { Key } from '@/frontend/types.ts'; 
// Removed unused ShortcutKey import, ShortcutSetter is a default import from the file, not named.
// Correcting ShortcutSetter import to be a named import
import { ShortcutSetter } from '@/components/shortcut-setter.tsx';

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

// Local ShortcutKey interface - ensure it matches the one in ShortcutSetter if not importing
// Or import from ShortcutSetter: import { ShortcutKey } from '@/components/shortcut-setter.tsx';
// For now, keeping it local but ensuring it allows nulls as per ShortcutSetter
interface LocalShortcutKey {
  modifier?: (Key | null)[]; 
  key: Key | null;
}

export function AddShortcutModal({ isOpen, onOpenChange }: AddShortcutModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  const [scriptPath, setScriptPath] = useState('');
  // Ensure initial state matches the updated ShortcutKey allowing nulls
  const [definedShortcut, setDefinedShortcut] = useState<LocalShortcutKey | null>(
    { modifier: [Key.Ctrl, Key.Shift], key: Key.P } 
  );

  const handleActionTypeSelect = (actionTypeId: string) => {
    setSelectedActionType(actionTypeId);
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
        console.log('Submitting shortcut:', { selectedActionType, scriptPath, definedShortcut });
        handleCancel(); 
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setSelectedActionType(null);
    setCurrentStep(1);
    setScriptPath('');
    // Reset definedShortcut to initial or a default empty state if desired
    setDefinedShortcut({ modifier: [Key.Ctrl, Key.Shift], key: Key.P }); // Or set to null / empty structure
    onOpenChange(false);
  };

  const getActionName = () => {
    return actionTypes.find(at => at.id === selectedActionType)?.name || 'Selected Action';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80%] max-w-[800px]" onEscapeKeyDown={(event) => { event.preventDefault(); } }>
        <DialogHeader>
          <DialogTitle>
            Add New Shortcut - {currentStep === 1 ? `Step ${currentStep}: Choose Action Type` : `Step ${currentStep}: Configure ${getActionName()}`}
          </DialogTitle>
          {currentStep === 1 && (
            <DialogDescription>
              Select the type of action this shortcut will perform.
            </DialogDescription>
          )}
           {currentStep === 2 && selectedActionType === 'script' && (
            <DialogDescription>
              Set the shortcut combination and provide the path to your script.
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

        {currentStep === 2 && selectedActionType === 'script' && (
          <div className="py-4 space-y-6">
            <ShortcutSetter shortcut={definedShortcut} setShortcut={setDefinedShortcut} />
            
            <div>
              <label htmlFor="scriptPath" className="block text-sm font-medium text-gray-700 mb-1">
                Script Path
              </label>
              <Input 
                type="text" 
                id="scriptPath" 
                value={scriptPath}
                onChange={(e) => setScriptPath(e.target.value)}
                placeholder="/path/to/your/script.sh or C:\path\to\your\script.bat"
              />
            </div>
          </div>
        )}
        
        {currentStep === 2 && selectedActionType !== 'script' && selectedActionType !== null && (
            <div className="py-4 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mb-3" />
                <p className="text-lg font-semibold">Configuration for "{getActionName()}" is not yet implemented.</p>
                <p className="text-sm text-muted-foreground">Please go back and select a different action type or wait for future updates.</p>
            </div>
        )}

        {currentStep === 3 && (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Review Shortcut</h3>
            <p><strong>Action Type:</strong> {getActionName()}</p>
            {selectedActionType === 'script' && <p><strong>Script Path:</strong> {scriptPath}</p>}
            <p><strong>Shortcut:</strong> 
                {definedShortcut?.modifier?.filter(mod => mod !== null).map((modKey, index, arr) => (
                  <React.Fragment key={`${modKey}-${index}-review-fragment`}>
                    <KeyIcon key={`${modKey}-${index}-review`}>{modKey!}</KeyIcon>
                    {(index < arr.length - 1 || definedShortcut.key) && (
                        <span className="mx-1">+</span>
                    )}
                  </React.Fragment>
                ))}
                {definedShortcut?.key && <KeyIcon key={`${definedShortcut.key.toString()}-review`}>{definedShortcut.key}</KeyIcon>}
                {!definedShortcut?.key && (!definedShortcut?.modifier || definedShortcut.modifier.filter(m=>m!==null).length === 0) && (
                    <span className="text-muted-foreground">No shortcut defined.</span>
                )}
            </p>
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
          <Button onClick={handleNext} disabled={currentStep === 1 && !selectedActionType}>
            {currentStep === 3 ? 'Finish' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 