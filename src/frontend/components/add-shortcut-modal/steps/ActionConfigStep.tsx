import React from 'react';
import { Button } from "@/frontend/components/ui/button.tsx";
import { Input } from "@/frontend/components/ui/input.tsx";
import { Card } from "@/frontend/components/ui/card.tsx";
import { AlertTriangle } from "lucide-react";
import { fileSystemTypes, textManipulationTypes } from '../config.ts';
import { StepData } from '@/frontend/types.ts';

interface ActionConfigStepProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
  handleTextManipulationTypeSelect: (textManipulationTypeId: string) => void;
  handleBuiltinTypeSelect: (builtinTypeId: string) => void;
  handleFileSystemTypeSelect: (fileSystemTypeId: string) => void;
  getActionName: () => string;
}

export const ActionConfigStep: React.FC<ActionConfigStepProps> = ({ 
  stepData, 
  updateStepData, 
  handleTextManipulationTypeSelect,
  handleBuiltinTypeSelect,
  handleFileSystemTypeSelect,
  getActionName 
}) => {
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
              Open Website(s)
            </Button>
            <Button 
              variant={stepData.builtinType === 'openApplications' ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleBuiltinTypeSelect('openApplications')}
            >
              Open Application(s)
            </Button>
            <Button 
              variant={stepData.builtinType === 'organizeDesktop' ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleBuiltinTypeSelect('organizeDesktop')}
            >
              Organize Desktop
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