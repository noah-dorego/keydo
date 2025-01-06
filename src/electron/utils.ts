import path from "path";
import { app, globalShortcut } from "electron";
import { Key } from "./types.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}

export const registerShortcut = (command: Key[], action: string) => {
  try {
    globalShortcut.register(command.join("+"), () => console.log(action));
    return true;
  } catch (error) {
    return false;
  }
};

export const removeShortcut = (command: Key[]) => {
  const commandString = command.join("+");
  if (globalShortcut.isRegistered(commandString)) {
    globalShortcut.unregister(command.join("+"));
    return true;
  } else {
    return false;
  }
};
