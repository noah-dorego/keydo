import React from 'react';
import { Input } from "@/frontend/components/ui/input.tsx";
import { StepData } from '@/frontend/types.ts';

interface ApplicationInputStepProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
}

export const ApplicationInputStep: React.FC<ApplicationInputStepProps> = ({ stepData, updateStepData }) => (
  <div>
    <h3 className="text-md font-medium">Enter Application Paths</h3>
    <h6 className="mb-4 text-sm text-muted-foreground">
      Enter the paths to the applications you want to open when this shortcut is triggered. Separate multiple applications with commas.
    </h6>
    <Input
      type="text"
      id="applicationPath"
      value={stepData.applicationPath}
      onChange={(e) => updateStepData({ applicationPath: e.target.value })}
      placeholder="notepad.exe, calc.exe, chrome.exe"
    />
    <h6 className="mt-2 text-xs text-muted-foreground">
      Examples: notepad.exe, calc.exe, chrome.exe, "C:\Program Files\Notepad++\notepad++.exe"
    </h6>
  </div>
); 