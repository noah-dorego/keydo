import React from 'react';
import { Input } from "@/frontend/components/ui/input.tsx";
import { StepData } from '@/frontend/types.ts';

interface TextInputStepProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
}

export const TextInputStep: React.FC<TextInputStepProps> = ({ stepData, updateStepData }) => (
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