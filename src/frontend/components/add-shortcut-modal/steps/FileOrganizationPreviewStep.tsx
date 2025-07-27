import React from 'react';
import { Card } from "@/frontend/components/ui/card.tsx";
import { Folder } from "lucide-react";
import { FILE_ORGANIZATION_EXTENSIONS } from '@/frontend/constants.ts';

export const FileOrganizationPreviewStep: React.FC = () => {
  // Group extensions by folder
  const folderGroups: Record<string, string[]> = {};
  Object.entries(FILE_ORGANIZATION_EXTENSIONS).forEach(([ext, folder]) => {
    if (!folderGroups[folder]) {
      folderGroups[folder] = [];
    }
    folderGroups[folder].push(ext);
  });

  return (
    <div>
      <h3 className="text-md font-medium">File Organization Preview</h3>
      <h6 className="mb-4 text-sm text-muted-foreground">
        Files on your desktop will be organized into the following folders based on their extensions:
      </h6>
      
      <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
        <div className="flex items-center mb-2">
          <Folder className="w-5 h-5 mr-2 text-blue-600" />
          <span className="font-medium text-blue-800">Desktop Organization Structure</span>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          Files will be moved from your desktop into these organized folders:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(folderGroups).map(([folder, extensions]) => (
            <div key={folder} className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-800 mb-1">{folder}</div>
              <div className="text-xs text-gray-600">
                {extensions.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}; 