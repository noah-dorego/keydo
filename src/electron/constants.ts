import { globalShortcut } from "electron";

import { Key } from "./types.js";

export const constants = {
  startCommand: [Key.Alt, Key.CommandOrControl, Key.X],
};

export const registerShortcut = (command: Key[], action: () => void) => {
  try {
    globalShortcut.register(command.join("+"), action);
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
