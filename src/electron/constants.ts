import { app } from "electron";
import path from "path";

export const startCommand = "Alt+CommandOrControl+X";
export const SHORTCUT_LIST_PATH = path.join(
  app.getPath("userData"),
  "shortcut_list.json"
);
