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
  SquareTerminal,
  Lightbulb,
  FolderOpen,
  AlertTriangle,
  Hash,
  Type,
  Clipboard,
  Wrench,
  Cog,
  File,
  Folder,
  Sparkles,
} from "lucide-react";
import { Key } from "@/frontend/types.ts";
import { ShortcutInput } from "@/frontend/components/shortcut-input.tsx";
import { FILE_ORGANIZATION_EXTENSIONS } from "@/frontend/constants.ts";

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

interface FileStructureType {
  id: string;
  name: string;
  icon: React.ElementType;
}

const actionTypes: ActionType[] = [
  { id: "basic", name: "Basic Shortcuts", icon: Wrench },
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

const fileSystemTypes: FileStructureType[] = [
  { id: 'openFile', name: 'Open File', icon: File },
  { id: 'openDirectory', name: 'Open Directory', icon: Folder },
  { id: 'cleanDesktop', name: 'Clean Desktop', icon: Sparkles },
  { id: 'openTerminal', name: 'Open Terminal in Directory', icon: SquareTerminal },
];

// Step configuration - defines the flow for each action type
const stepConfig: Record<string, string[] | Record<string, string[]>> = {
  // Action type -> step sequence
  basic: {
    // Basic subtypes -> step sequence
    openWebsite: ['actionType', 'actionConfig', 'websiteInput', 'shortcutConfig'],
    organizeDesktop: ['actionType', 'actionConfig', 'fileOrganizationPreview', 'shortcutConfig'],
    closeWindows: ['actionType', 'shortcutConfig'],
  },
  file: {
    // File system subtypes -> step sequence
    openFile: ['actionType', 'actionConfig', 'shortcutConfig'],
    openDirectory: ['actionType', 'actionConfig', 'shortcutConfig'],
    cleanDesktop: ['actionType', 'shortcutConfig'],
    openTerminal: ['actionType', 'actionConfig', 'shortcutConfig'],
  },
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
  builtinType: string;
  fileSystemType: string;
  scriptPath: string;
  websiteUrl: string;
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
    builtinType: "",
    fileSystemType: "",
    scriptPath: "",
    websiteUrl: "",
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
    
    // For basic actions, we need the subtype to determine the flow
    if (stepData.actionType === 'basic' && typeof config === 'object') {
      if (!stepData.builtinType) return ['actionType', 'actionConfig'];
      const basicConfig = config[stepData.builtinType];
      return Array.isArray(basicConfig) ? basicConfig : ['actionType', 'actionConfig'];
    }
    
    // For file system actions, we need the subtype to determine the flow
    if (stepData.actionType === 'file' && typeof config === 'object') {
      if (!stepData.fileSystemType) return ['actionType', 'actionConfig'];
      const fileConfig = config[stepData.fileSystemType];
      return Array.isArray(fileConfig) ? fileConfig : ['actionType', 'actionConfig'];
    }
    
    return ['actionType', 'shortcutConfig'];
  }, [stepData.actionType, stepData.textManipulationType, stepData.builtinType, stepData.fileSystemType]);

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

  const handleBuiltinTypeSelect = (builtinTypeId: string) => {
    updateStepData({ builtinType: builtinTypeId });
  };

  const handleFileSystemTypeSelect = (fileSystemTypeId: string) => {
    updateStepData({ fileSystemType: fileSystemTypeId });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'actionType':
        return !!stepData.actionType;
      case 'actionConfig':
        if (stepData.actionType === 'text') {
          return !!stepData.textManipulationType;
        }
        if (stepData.actionType === 'basic') {
          return !!stepData.builtinType;
        }
        if (stepData.actionType === 'file') {
          return !!stepData.fileSystemType;
        }
        if (stepData.actionType === 'script') {
          return !!stepData.scriptPath.trim();
        }
        return true;
      case 'textInput':
        return !!stepData.pasteText.trim();
      case 'websiteInput':
        return !!stepData.websiteUrl.trim();
      case 'fileOrganizationPreview':
        return true; // This step is just informational, no validation needed
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
        case "basic":
          actionDetails = {
            actionType: stepData.builtinType,
            ...(stepData.builtinType === 'openWebsite' && { websiteUrl: stepData.websiteUrl }),
          };
          break;
        case "file":
          actionDetails = {
            actionType: stepData.fileSystemType,
          };
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
      builtinType: "",
      fileSystemType: "",
      scriptPath: "",
      websiteUrl: "",
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
          <div>
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
              className="my-1"
            />
            <h6 className="my-1 text-xs text-muted-foreground">
              Accepted file types: .exe, .bat, .sh, .py, .js, .ts
            </h6>
          </div>
        );
      case "file":
        return (
          <>
            <h3 className="text-md font-medium">Choose File System Action</h3>
            <h6 className="mb-4 text-sm text-muted-foreground">
              Select the type of file system action this shortcut will perform.
            </h6>
            <div className="grid grid-cols-2 gap-4">
              {fileSystemTypes.map((fileSystem) => (
                <Button
                  key={fileSystem.id}
                  variant={
                    stepData.fileSystemType === fileSystem.id
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleFileSystemTypeSelect(fileSystem.id)
                  }
                  className="flex flex-col items-center justify-center h-24 p-4"
                >
                  <fileSystem.icon className="w-8 h-8 mb-2" />
                  <span>{fileSystem.name}</span>
                </Button>
              ))}
            </div>
          </>
        );
      case "basic":
        return (
          <>
            <h3 className="text-md font-medium">Choose Basic Action</h3>
            <h6 className="mb-4 text-sm text-muted-foreground">
              Select the type of basic action this shortcut will perform.
            </h6>
            <div className="flex flex-col gap-2">
              <Button 
                variant={stepData.builtinType === 'openWebsite' ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleBuiltinTypeSelect('openWebsite')}
              >
                Open Website
              </Button>
              <Button 
                variant={stepData.builtinType === 'organizeDesktop' ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleBuiltinTypeSelect('organizeDesktop')}
              >
                Organize Desktop
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={true}
              >
                Close Specific Windows
              </Button>
            </div>
          </>
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

  const renderWebsiteInputStep = () => (
    <div>
      <h3 className="text-md font-medium">Enter Website URL</h3>
      <h6 className="mb-4 text-sm text-muted-foreground">
        Enter the URL of the website you want to open when this shortcut is triggered.
      </h6>
      <Input
        type="url"
        id="websiteUrl"
        value={stepData.websiteUrl}
        onChange={(e) => updateStepData({ websiteUrl: e.target.value })}
        placeholder="https://example.com"
      />
    </div>
  );

  const renderFileOrganizationPreviewStep = () => {
    // Group extensions by folder
    const folderGroups: Record<string, string[]> = {};
    Object.entries(FILE_ORGANIZATION_EXTENSIONS).forEach(([ext, folder]) => {
      if (!folderGroups[folder]) {
        folderGroups[folder] = [];
      }
      folderGroups[folder].push(ext);
    });

    return (
      <div>
        <h3 className="text-md font-medium">File Organization Preview</h3>
        <h6 className="mb-4 text-sm text-muted-foreground">
          Files on your desktop will be organized into the following folders based on their extensions:
        </h6>
        
        <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
          <div className="flex items-center mb-2">
            <Folder className="w-5 h-5 mr-2 text-blue-600" />
            <span className="font-medium text-blue-800">Desktop Organization Structure</span>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Files will be moved from your desktop into these organized folders:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(folderGroups).map(([folder, extensions]) => (
              <div key={folder} className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-800 mb-1">{folder}</div>
                <div className="text-xs text-gray-600">
                  {extensions.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

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
      case 'websiteInput':
        return renderWebsiteInputStep();
      case 'fileOrganizationPreview':
        return renderFileOrganizationPreviewStep();
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
