import { globalShortcut } from "electron";

import { Key } from "./types.js";

export const registerShortcut = (command: Key[], action: () => void) => {
  globalShortcut.register(command.join("+"), action);
};
