import { app } from "electron";
import path from "path";
import { Key } from "./types.js";

export const startCommand = [Key.Alt, Key.CommandOrControl, Key.X];
export const SHORTCUT_LIST_PATH = path.join(
  app.getPath("userData"),
  "shortcut_list.json"
);
