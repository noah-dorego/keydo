import React, { useEffect, useState } from "react";
import { Switch } from "@/frontend/components/ui/switch.tsx";
import { useTheme } from "@/frontend/components/theme-provider.tsx";
import { Settings, Key} from "@/frontend/types.ts";
import { KeyIcon } from "../components/key-icon.tsx";

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    notificationBannersEnabled: true,
    notificationSoundsEnabled: true,
    launchOnStartup: false,
  });
  const { theme, setTheme } = useTheme();

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
      <div className="overflow-y-auto px-4 py-4">
        <div className="max-w-[500px] flex flex-col gap-4">
          <section>
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <label>Theme</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === "light"}
                      onChange={() => setTheme("light")}
                      className="text-primary"
                    />
                    <span>Light</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === "dark"}
                      onChange={() => setTheme("dark")}
                      className="text-primary"
                    />
                    <span>Dark</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={theme === "system"}
                      onChange={() => setTheme("system")}
                      className="text-primary"
                    />
                    <span>System</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <label htmlFor="notification-banners">Notification Banners</label>
                <Switch
                  id="notification-banners"
                  checked={settings.notificationBannersEnabled}
                  onCheckedChange={(value: boolean) =>
                    handleSettingChange("notificationBannersEnabled", value)
                  }
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
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

          <section>
            <h2 className="text-lg font-semibold mb-4">Application</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <label htmlFor="launch-on-startup">Shortcut to Open keydo</label>
                <div className="flex items-center space-x-2">
                  <KeyIcon>{Key.CmdOrCtrl}</KeyIcon>
                  <span>+</span>
                  <KeyIcon>{Key.Alt}</KeyIcon>
                  <span>+</span>
                  <KeyIcon>{Key.K}</KeyIcon>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <label htmlFor="launch-on-startup">Launch on Startup</label>
                <Switch
                  id="launch-on-startup"
                  checked={settings.launchOnStartup}
                  onCheckedChange={(value: boolean) =>
                    handleSettingChange("launchOnStartup", value)
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 