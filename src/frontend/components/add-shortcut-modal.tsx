import React, { useState, useMemo } from "react";
import { Button } from "@/frontend/components/ui/button.tsx";
import { Input } from "@/frontend/components/ui/input.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog.tsx";
import { Card } from "@/frontend/components/ui/card.tsx";
import {
  FileText,
  Terminal,
  Lightbulb,
  FolderOpen,
  AlertTriangle,
  Hash,
  Type,
  Clipboard,
  Wrench,
  Cog,
} from "lucide-react";
import { Key } from "@/frontend/types.ts";
import { ShortcutInput } from "@/frontend/components/shortcut-input.tsx";

interface ActionType {
  id: string;
  name: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface TextManipulationType {
  id: string;
  name: string;
  icon: React.ElementType;
}

const actionTypes: ActionType[] = [
  { id: "builtin", name: "Built-in Shortcuts", icon: Wrench },
  { id: "text", name: "Text Manipulation", icon: FileText },
  { id: "file", name: "File System", icon: FolderOpen },
  { id: "script", name: "Run Script", icon: Terminal },
  { id: "ai", name: "AI Action", icon: Lightbulb, disabled: true },
  { id: "custom", name: "Custom Shortcuts", icon: Cog, disabled: true },
];

const textManipulationTypes: TextManipulationType[] = [
  { id: 'wordCount', name: 'Word Count', icon: Hash },
  { id: 'upperCase', name: 'Upper Case', icon: Type },
  { id: 'titleCase', name: 'Title Case', icon: Type },
  { id: 'pasteText', name: 'Paste Text', icon: Clipboard },
];

// Step configuration - defines the flow for each action type
const stepConfig: Record<string, string[] | Record<string, string[]>> = {
  // Action type -> step sequence
  builtin: ['actionType', 'shortcutConfig'],
  file: ['actionType', 'shortcutConfig'],
  script: ['actionType', 'actionConfig', 'shortcutConfig'],
  ai: ['actionType', 'shortcutConfig'],
  custom: ['actionType', 'shortcutConfig'],
  text: {
    // Text manipulation subtypes -> step sequence
    wordCount: ['actionType', 'actionConfig', 'shortcutConfig'],
    upperCase: ['actionType', 'actionConfig', 'shortcutConfig'],
    titleCase: ['actionType', 'actionConfig', 'shortcutConfig'],
    pasteText: ['actionType', 'actionConfig', 'textInput', 'shortcutConfig'],
  }
};

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

// Step data interface
interface StepData {
  actionType: string;
  textManipulationType: string;
  scriptPath: string;
  shortcutName: string;
  definedShortcut: LocalShortcutKey | null;
  pasteText: string; // New field for paste text input
}

export function AddShortcutModal({
  isOpen,
  onOpenChange,
  onShortcutAdded,
}: AddShortcutModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<StepData>({
    actionType: "",
    textManipulationType: "",
    scriptPath: "",
    shortcutName: "",
    definedShortcut: { modifier: [Key.Ctrl, Key.Shift], key: Key.P },
    pasteText: "", // New field for paste text input
  });

  // Compute the current step flow based on selections
  const currentStepFlow = useMemo((): string[] => {
    if (!stepData.actionType) return ['actionType'];
    
    const config = stepConfig[stepData.actionType];
    if (Array.isArray(config)) {
      return config;
    }
    
    // For text actions, we need the subtype to determine the flow
    if (stepData.actionType === 'text' && typeof config === 'object') {
      if (!stepData.textManipulationType) return ['actionType', 'actionConfig'];
      const textConfig = config[stepData.textManipulationType];
      return Array.isArray(textConfig) ? textConfig : ['actionType', 'actionConfig'];
    }
    
    return ['actionType', 'shortcutConfig'];
  }, [stepData.actionType, stepData.textManipulationType]);

  const currentStep = currentStepFlow[currentStepIndex];

  const updateStepData = (updates: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...updates }));
  };

  const handleActionTypeSelect = (actionTypeId: string) => {
    updateStepData({ actionType: actionTypeId });
  };

  const handleTextManipulationTypeSelect = (textManipulationTypeId: string) => {
    updateStepData({ textManipulationType: textManipulationTypeId });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'actionType':
        return !!stepData.actionType;
      case 'actionConfig':
        if (stepData.actionType === 'text') {
          return !!stepData.textManipulationType;
        }
        if (stepData.actionType === 'script') {
          return !!stepData.scriptPath.trim();
        }
        return true;
      case 'textInput':
        return !!stepData.pasteText.trim();
      case 'shortcutConfig':
        return !!stepData.shortcutName.trim() && !!stepData.definedShortcut?.key;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      alert("Please complete the current step before proceeding.");
      return;
    }

    if (currentStepIndex < currentStepFlow.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Final step - submit the shortcut
      const shortcutString = stepData.definedShortcut ? 
        stepData.definedShortcut.modifier?.join('+') + '+' + stepData.definedShortcut.key : '';
      
      let actionDetails = {};
      switch (stepData.actionType) {
        case 'text':
          actionDetails = {
            actionType: stepData.textManipulationType,
            ...(stepData.textManipulationType === 'pasteText' && { pasteText: stepData.pasteText }),
          };
          break;
        case "file":
          break;
        case "script":
          actionDetails = {
            scriptPath: stepData.scriptPath,
          };
          break;
        case "ai":
          break;
        default:
          break;
      }

      const shortcutData = {
        id: Date.now().toString(),
        name: stepData.shortcutName,
        accelerator: shortcutString,
        actionType: stepData.actionType,
        actionDetails: actionDetails,
      };
      
      if (window.electron && typeof window.electron.addShortcut === 'function') {
        window.electron.addShortcut(shortcutData).then(() => {
          onShortcutAdded();
        });
      } else {
        console.error('addShortcut function not found on window.electron. Ensure it is exposed via preload script.');
      }
      
      console.log('Submitting shortcut:', shortcutData);
      handleCancel();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCancel = () => {
    setStepData({
      actionType: "",
      textManipulationType: "",
      scriptPath: "",
      shortcutName: "",
      definedShortcut: { modifier: [Key.Ctrl, Key.Shift], key: Key.P },
      pasteText: "",
    });
    setCurrentStepIndex(0);
    onOpenChange(false);
  };

  const getActionName = () => {
    return (
      actionTypes.find((at) => at.id === stepData.actionType)?.name ||
      "Selected Action"
    );
  };

  // Step components
  const renderActionTypeStep = () => (
    <div>
      <h3 className="text-md font-medium">Choose Action Type</h3>
      <h6 className="mb-4 text-sm text-muted-foreground">
        Select the type of action this shortcut will perform.
      </h6>
      <div className="grid grid-cols-2 gap-4">
        {actionTypes.map((action) => (
          <Button
            key={action.id}
            variant={
              stepData.actionType === action.id ? "default" : "outline"
            }
            onClick={() => handleActionTypeSelect(action.id)}
            className="flex flex-col items-center justify-center h-18 p-4 disabled:bg-gray-300"
            disabled={action.disabled}
          >
            <action.icon className="w-8 h-8 mb-2" />
            <span>{action.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderActionConfigStep = () => {
    switch (stepData.actionType) {
      case "text":
        return (
          <>
            <h3 className="text-md font-medium">
              Choose Text Manipulation Type
            </h3>
            <h6 className="mb-4 text-sm text-muted-foreground">
              Select the type of text manipulation this shortcut will perform.
            </h6>
            <Card className="p-2 mb-4 bg-yellow-500/10 border-yellow-500">
              <p className="font-medium">
                ⚠️ NOTE: Currently, text manipulation is only performed on
                copied text.
              </p>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              {textManipulationTypes.map((textManipulation) => (
                <Button
                  key={textManipulation.id}
                  variant={
                    stepData.textManipulationType === textManipulation.id
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleTextManipulationTypeSelect(textManipulation.id)
                  }
                  className="flex flex-col items-center justify-center h-24 p-4"
                >
                  <textManipulation.icon className="w-8 h-8 mb-2" />
                  <span>{textManipulation.name}</span>
                </Button>
              ))}
            </div>
          </>
        );
      case "script":
        return (
          <>
            <h3 className="text-md font-medium">Set Script Path</h3>
            <h6 className="mb-2 text-sm text-muted-foreground">
              Set the path to your script.
            </h6>
            <Input
              type="text"
              id="scriptPath"
              value={stepData.scriptPath}
              onChange={(e) => updateStepData({ scriptPath: e.target.value })}
              placeholder="Enter absolute path (/path/to/your/script or C:\path\to\your\script)"
            />
            <h6 className="my-1 text-xs text-muted-foreground">
              Accepted file types: .exe, .bat, .sh, .py, .js, .ts
            </h6>
          </>
        );
      case "builtin":
        return (
          <div>
            <h3 className="text-md font-medium mb-4">Built-in Shortcuts</h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start">
                Open Website
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Organize Desktop
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Close Specific Windows
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-4 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-3" />
            <p className="text-lg font-semibold">
              Configuration for "{getActionName()}" is not yet implemented.
            </p>
          </div>
        );
    }
  };

  const renderTextInputStep = () => (
    <div>
      <h3 className="text-md font-medium">Enter Text to Paste</h3>
      <h6 className="mb-4 text-sm text-muted-foreground">
        Enter the text that will be pasted when this shortcut is triggered.
      </h6>
      <Input
        type="text"
        id="pasteText"
        value={stepData.pasteText}
        onChange={(e) => updateStepData({ pasteText: e.target.value })}
        placeholder="Enter text to paste"
      />
    </div>
  );

  const renderShortcutConfigStep = () => (
    <div>
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Enter Shortcut Name</h4>
        <Input
          type="text"
          id="shortcutName"
          value={stepData.shortcutName}
          onChange={(e) => updateStepData({ shortcutName: e.target.value })}
          placeholder="Enter shortcut name"
        />
      </div>
      <ShortcutInput
        shortcut={stepData.definedShortcut}
        setShortcut={(shortcut) => updateStepData({ definedShortcut: shortcut })}
      />
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'actionType':
        return renderActionTypeStep();
      case 'actionConfig':
        return renderActionConfigStep();
      case 'textInput':
        return renderTextInputStep();
      case 'shortcutConfig':
        return renderShortcutConfigStep();
      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  const isNextDisabled = () => {
    return !validateCurrentStep();
  };

  const isLastStep = currentStepIndex === currentStepFlow.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[80%] max-w-[800px]"
        onEscapeKeyDown={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Shortcut</DialogTitle>
        </DialogHeader>

        {renderCurrentStep()}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {currentStepIndex > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
