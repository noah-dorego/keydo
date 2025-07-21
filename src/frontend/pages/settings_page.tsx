import React, { useEffect, useState } from "react";
import { Switch } from "@/frontend/components/ui/switch.tsx";

type Settings = {
  notificationBannersEnabled: boolean;
  notificationSoundsEnabled: boolean;
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    notificationBannersEnabled: true,
    notificationSoundsEnabled: true,
  });

  useEffect(() => {
    window.electron.getSettings().then(setSettings);
  }, []);

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    window.electron.updateSettings(key, value);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="notification-banners">Notification Banners</label>
              <Switch
                id="notification-banners"
                checked={settings.notificationBannersEnabled}
                onCheckedChange={(value: boolean) =>
                  handleSettingChange("notificationBannersEnabled", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="notification-sounds">Notification Sounds</label>
              <Switch
                id="notification-sounds"
                checked={settings.notificationSoundsEnabled}
                onCheckedChange={(value: boolean) =>
                  handleSettingChange("notificationSoundsEnabled", value)
                }
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 