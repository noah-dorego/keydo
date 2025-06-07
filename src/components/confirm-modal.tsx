import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { VariantProps } from 'class-variance-authority';

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  action: string;
  buttonText?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  title?: string;
}

export function ConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  action,
  buttonText = 'Confirm',
  buttonVariant = 'destructive',
  title = 'Are you sure?',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to {action}?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={buttonVariant} onClick={handleConfirm}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 