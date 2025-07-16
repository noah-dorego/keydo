import React from 'react';

export function SettingsPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {/* Add your settings content here */}
        <p className="text-center text-gray-500 mt-8">
          Settings page content will go here.
        </p>
      </div>
    </div>
  );
} 