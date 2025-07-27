import React from 'react';
import { Input } from "@/frontend/components/ui/input.tsx";
import { StepData } from '@/frontend/types.ts';

interface WebsiteInputStepProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
}

export const WebsiteInputStep: React.FC<WebsiteInputStepProps> = ({ stepData, updateStepData }) => (
  <div>
    <h3 className="text-md font-medium">Enter Website URL(s)</h3>
    <h6 className="mb-4 text-sm text-muted-foreground">
      Enter the URLs of the websites you want to open when this shortcut is triggered. Separate multiple websites with commas.
    </h6>
    <Input
      type="text"
      id="websiteUrl"
      value={stepData.websiteUrl}
      onChange={(e) => updateStepData({ websiteUrl: e.target.value })}
      placeholder="https://google.com, https://github.com, https://stackoverflow.com"
    />
    <h6 className="mt-2 text-xs text-muted-foreground">
      Examples: https://google.com, https://github.com, https://stackoverflow.com
    </h6>
  </div>
); 