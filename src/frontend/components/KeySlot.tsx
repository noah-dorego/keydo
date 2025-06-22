import React from 'react';
import { KeyIcon } from '@/frontend/components/key-icon.tsx';
import { Key } from '@/frontend/types.ts';
import { Card } from '@/frontend/components/ui/card.tsx'; // Assuming Card is in ui folder

interface KeySlotProps {
  keyVal: Key | null;
  isListening: boolean;
  onClick: () => void;
  placeholderText?: string;
  title?: string;
}

export function KeySlot({ 
  keyVal, 
  isListening, 
  onClick, 
  placeholderText = "SET", 
  title 
}: KeySlotProps) {
  const displayContent = keyVal ? (
    <KeyIcon>{keyVal}</KeyIcon>
  ) : (
    <Card className="py-1 px-2 font-bold border-dashed border-gray-400">{placeholderText}</Card>
  );

  return (
    <div
      onClick={onClick}
      className={`p-2 min-w-[45px] h-[36px] text-center cursor-pointer hover:bg-accent flex items-center justify-center transition-all duration-150 ease-in-out`}
      title={title || (keyVal ? `Click to change ${keyVal}` : 'Click to set key')}
    >
      {isListening ? <Card className="py-1 px-2 font-bold animate-pulse border-dashed border-gray-400">Enter Key...</Card> : displayContent}
    </div>
  );
} 