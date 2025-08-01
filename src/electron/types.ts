export type ActionParams = string | number | boolean | object;

export type ShortcutProps = {
    id: string;
    name: string;
    accelerator: string;
    actionType: string;
    actionDetails: Record<string, ActionParams>;
  };

export enum ActionType {
  Script = "script",
  Text = "text",
  File = "file",
  Builtin = "builtin",
  Ai = "ai",
}

export type Settings = {
  notificationBannersEnabled: boolean;
  notificationSoundsEnabled: boolean;
  launchOnStartup: boolean;
}; 