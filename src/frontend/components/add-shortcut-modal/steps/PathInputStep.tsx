import React from 'react';
import { Input } from "@/frontend/components/ui/input.tsx";
import { StepData } from '@/frontend/types.ts';

interface PathInputStepProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
}

export const PathInputStep: React.FC<PathInputStepProps> = ({ stepData, updateStepData }) => (
  <div>
    <h3 className="text-md font-medium">Enter Path</h3>
    <h6 className="mb-4 text-sm text-muted-foreground">
      Enter the absolute path for the file or directory.
    </h6>
    <Input
      type="text"
      id="filePath"
      value={stepData.filePath}
      onChange={(e) => updateStepData({ filePath: e.target.value })}
      placeholder="e.g., C:\\Users\\YourUser\\Desktop or /home/user/documents"
    />
  </div>
); 