import path from "path";
import { app, globalShortcut } from "electron";
import fs from "fs";
import { SHORTCUT_LIST_PATH } from "./constants.js";
import { ShortcutProps } from "./types.js";

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

export const registerShortcut = (accelerator: string, actionType: string) => {
  try {
    globalShortcut.register(accelerator, () => console.log(actionType));
    return true;
  } catch (error) {
    console.log("Error registering shortcut", error);
    return false;
  }
};

export const removeShortcut = (accelerator: string) => {
  if (globalShortcut.isRegistered(accelerator)) {
    globalShortcut.unregister(accelerator);
    return true;
  } else {
    return false;
  }
};

export function getShortcutList() {
  try {
    const data = fs.readFileSync(SHORTCUT_LIST_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error retrieving user data", error);
    // you may want to propagate the error, up to you
    return null;
  }
}

export function saveShortcut(data: ShortcutProps) {
  fs.writeFileSync(SHORTCUT_LIST_PATH, JSON.stringify(data));
}
