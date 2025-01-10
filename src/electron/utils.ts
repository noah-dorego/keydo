import path from "path";
import { app, globalShortcut } from "electron";
import fs from "fs";
import { Key } from "./types.js";
import { SHORTCUT_LIST_PATH } from "./constants.js";

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

export function saveShortcut(data: object /* add type */) {
  fs.writeFileSync(SHORTCUT_LIST_PATH, JSON.stringify(data));
}
