import React, { useReducer, useEffect } from "react";
import { Button } from "@/frontend/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog.tsx";
import { AddShortcutModalProps, StepData } from "@/frontend/types.ts";
import { initialState, reducer } from "./reducer.ts";
import { ActionTypeStep } from "./steps/ActionTypeStep.tsx";
import { ActionConfigStep } from "./steps/ActionConfigStep.tsx";
import { TextInputStep } from "./steps/TextInputStep.tsx";
import { WebsiteInputStep } from "./steps/WebsiteInputStep.tsx";
import { ApplicationInputStep } from "./steps/ApplicationInputStep.tsx";
import { PathInputStep } from "./steps/PathInputStep.tsx";
import { FileOrganizationPreviewStep } from "./steps/FileOrganizationPreviewStep.tsx";
import { ShortcutConfigStep } from "./steps/ShortcutConfigStep.tsx";
import { actionTypes, stepConfig } from "./config.ts";
import { validateAddShortcutModalStep } from "@/frontend/lib/utils.ts";

export function AddShortcutModal({
  isOpen,
  onOpenChange,
  onShortcutAdded,
}: AddShortcutModalProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentStepIndex, stepData, stepFlow } = state;

  // Compute the current step flow based on selections
  useEffect(() => {
    if (!stepData.actionType) {
      dispatch({ type: "SET_STEP_FLOW", payload: ['actionType'] });
      return;
    }

    const config = stepConfig[stepData.actionType];
    if (Array.isArray(config)) {
      dispatch({ type: "SET_STEP_FLOW", payload: config });
      return;
    }
    
    // For text actions, we need the subtype to determine the flow
    if (stepData.actionType === 'text' && typeof config === 'object') {
      if (!stepData.textManipulationType) {
        dispatch({ type: "SET_STEP_FLOW", payload: ['actionType', 'actionConfig'] });
        return;
      }
      const textConfig = config[stepData.textManipulationType];
      dispatch({ type: "SET_STEP_FLOW", payload: Array.isArray(textConfig) ? textConfig : ['actionType', 'actionConfig'] });
      return;
    }
    
    // For basic actions, we need the subtype to determine the flow
    if (stepData.actionType === 'basic' && typeof config === 'object') {
      if (!stepData.builtinType) {
        dispatch({ type: "SET_STEP_FLOW", payload: ['actionType', 'actionConfig'] });
        return;
      }
      const basicConfig = config[stepData.builtinType];
      dispatch({ type: "SET_STEP_FLOW", payload: Array.isArray(basicConfig) ? basicConfig : ['actionType', 'actionConfig'] });
      return;
    }
    
    // For file system actions, we need the subtype to determine the flow
    if (stepData.actionType === 'file' && typeof config === 'object') {
      if (!stepData.fileSystemType) {
        dispatch({ type: "SET_STEP_FLOW", payload: ['actionType', 'actionConfig'] });
        return;
      }
      const fileConfig = config[stepData.fileSystemType];
      dispatch({ type: "SET_STEP_FLOW", payload: Array.isArray(fileConfig) ? fileConfig : ['actionType', 'actionConfig'] });
      return;
    }
    
    dispatch({ type: "SET_STEP_FLOW", payload: ['actionType', 'shortcutConfig'] });
  }, [stepData.actionType, stepData.textManipulationType, stepData.builtinType, stepData.fileSystemType, dispatch]);

  const currentStep = stepFlow[currentStepIndex];

  const updateStepData = (updates: Partial<StepData>) => {
    dispatch({ type: "SET_STEP_DATA", payload: updates });
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

  const handleNext = () => {
    if (!validateAddShortcutModalStep(currentStep, stepData)) {
      alert("Please complete the current step before proceeding.");
      return;
    }

    if (currentStepIndex < stepFlow.length - 1) {
      dispatch({ type: "SET_CURRENT_STEP_INDEX", payload: currentStepIndex + 1 });
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
            ...(stepData.builtinType === 'openWebsite' && { 
              websites: stepData.websiteUrl.split(',').map(url => url.trim()).filter(url => url.length > 0)
            }),
            ...(stepData.builtinType === 'openApplications' && { 
              applications: stepData.applicationPath.split(',').map(path => path.trim()).filter(path => path.length > 0)
            }),
          };
          break;
        case "file":
          actionDetails = {
            actionType: stepData.fileSystemType,
            path: stepData.filePath,
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
      dispatch({ type: "SET_CURRENT_STEP_INDEX", payload: currentStepIndex - 1 });
    }
  };

  const handleCancel = () => {
    dispatch({ type: "RESET_STATE" });
    onOpenChange(false);
  };

  const getActionName = () => {
    return (
      actionTypes.find((at) => at.id === stepData.actionType)?.name ||
      "Selected Action"
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'actionType':
        return <ActionTypeStep stepData={stepData} handleActionTypeSelect={handleActionTypeSelect} />;
      case 'actionConfig':
        return <ActionConfigStep 
                  stepData={stepData} 
                  updateStepData={updateStepData}
                  handleTextManipulationTypeSelect={handleTextManipulationTypeSelect}
                  handleBuiltinTypeSelect={handleBuiltinTypeSelect}
                  handleFileSystemTypeSelect={handleFileSystemTypeSelect}
                  getActionName={getActionName}
                />;
      case 'textInput':
        return <TextInputStep stepData={stepData} updateStepData={updateStepData} />;
      case 'websiteInput':
        return <WebsiteInputStep stepData={stepData} updateStepData={updateStepData} />;
      case 'applicationInput':
        return <ApplicationInputStep stepData={stepData} updateStepData={updateStepData} />;
      case 'pathInput':
        return <PathInputStep stepData={stepData} updateStepData={updateStepData} />;
      case 'fileOrganizationPreview':
        return <FileOrganizationPreviewStep />;
      case 'shortcutConfig':
        return <ShortcutConfigStep stepData={stepData} updateStepData={updateStepData} />;
      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  const isNextDisabled = () => {
    return !validateAddShortcutModalStep(currentStep, stepData);
  };

  const isLastStep = currentStepIndex === stepFlow.length - 1;

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