import React from 'react';
import { Button } from "@/frontend/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/frontend/components/ui/tooltip.tsx";
import { actionTypes } from '../config.ts';
import { StepData } from '@/frontend/types.ts';

interface ActionTypeStepProps {
  stepData: StepData;
  handleActionTypeSelect: (actionTypeId: string) => void;
}

export const ActionTypeStep: React.FC<ActionTypeStepProps> = ({ stepData, handleActionTypeSelect }) => (
  <div>
    <h3 className="text-md font-medium">Choose Action Type</h3>
    <h6 className="mb-4 text-sm text-muted-foreground">
      Select the type of action this shortcut will perform.
    </h6>
    <div className="grid grid-cols-2 gap-4">
      {actionTypes.map((action) => (
        action.comingSoon ? (
          <Tooltip delayDuration={0} key={action.id}>
            <TooltipTrigger>
              <Button
                variant={
                  stepData.actionType === action.id ? "default" : "outline"
                }
                onClick={() => handleActionTypeSelect(action.id)}
                className="flex flex-col w-full items-center justify-center h-18 p-4 disabled:bg-gray-300"
                disabled
              >
                <action.icon className="w-8 h-8 mb-2" />
                <span>{action.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            key={action.id}
            variant={
              stepData.actionType === action.id ? "default" : "outline"
            }
            onClick={() => handleActionTypeSelect(action.id)}
            className="flex flex-col w-full items-center justify-center h-18 p-4 disabled:bg-gray-300"
          >
            <action.icon className="w-8 h-8 mb-2" />
            <span>{action.name}</span>
          </Button>
        )
      ))}
    </div>
  </div>
); 