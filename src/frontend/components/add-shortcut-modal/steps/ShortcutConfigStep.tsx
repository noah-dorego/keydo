import React from 'react';
import { Input } from "@/frontend/components/ui/input.tsx";
import { ShortcutInput } from "@/frontend/components/shortcut-input.tsx";
import { StepData } from '@/frontend/types.ts';

interface ShortcutConfigStepProps {
  stepData: StepData;
  updateStepData: (updates: Partial<StepData>) => void;
}

export const ShortcutConfigStep: React.FC<ShortcutConfigStepProps> = ({ stepData, updateStepData }) => (
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