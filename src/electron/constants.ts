import { app } from "electron";
import path from "path";

export const startCommand = "Alt+CmdOrCtrl+K";
export const SHORTCUT_LIST_PATH = path.join(
  app.getPath("userData"),
  "shortcut_list.json"
);

export const FILE_ORGANIZATION_EXTENSIONS: Record<string, string> = {
  '.pdf': 'Documents',
  '.doc': 'Documents',
  '.docx': 'Documents',
  '.txt': 'Documents',
  '.jpg': 'Images',
  '.jpeg': 'Images',
  '.png': 'Images',
  '.gif': 'Images',
  '.bmp': 'Images',
  '.mp4': 'Videos',
  '.avi': 'Videos',
  '.mov': 'Videos',
  '.mp3': 'Music',
  '.wav': 'Music',
  '.flac': 'Music',
  '.zip': 'Archives',
  '.rar': 'Archives',
  '.7z': 'Archives',
};
