import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StepData } from "../types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateAddShortcutModalStep = (currentStep: string, stepData: StepData): boolean => {
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
    case 'pathInput':
      return !!stepData.filePath.trim();
    case 'textInput':
      return !!stepData.pasteText.trim();
    case 'websiteInput': {
      const urls = stepData.websiteUrl.split(',').map(url => url.trim()).filter(url => url.length > 0);
      return urls.length > 0;
    }
    case 'applicationInput': {
      const apps = stepData.applicationPath.split(',').map(path => path.trim()).filter(path => path.length > 0);
      return apps.length > 0;
    }
    case 'fileOrganizationPreview':
      return true; // This step is just informational, no validation needed
    case 'shortcutConfig':
      return !!stepData.shortcutName.trim() && !!stepData.definedShortcut?.key;
    default:
      return true;
  }
};
