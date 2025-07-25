import { globalShortcut } from "electron";
import fs from "fs/promises";
import Store from "electron-store";
import { ShortcutProps } from "./types.js";
import * as utils from "./utils.js";
import * as constants from "./constants.js";
import { Settings } from "./types.js";

export class ShortcutManager {
  private shortcutList: Record<string, ShortcutProps> = {};
  private store: Store<Settings>;

  constructor(store: Store<Settings>) {
    this.store = store;
    this.loadShortcuts();
  }

  private async loadShortcuts(): Promise<void> {
    try {
      await fs.access(constants.SHORTCUT_LIST_PATH);
      const rawData = await fs.readFile(constants.SHORTCUT_LIST_PATH, "utf-8");
      this.shortcutList = JSON.parse(rawData);
      this.reregisterShortcuts();
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log("Shortcut list file does not exist, creating a new one.");
        await this.saveShortcutList();
      } else {
        console.error("Failed to load or parse shortcut list:", error);
      }
    }
  }

  private reregisterShortcuts(): void {
    for (const id in this.shortcutList) {
      const shortcut = this.shortcutList[id];
      if (shortcut) {
        utils.registerShortcut(shortcut, this.store);
      }
    }
  }

  private async saveShortcutList(): Promise<void> {
    const tempPath = `${constants.SHORTCUT_LIST_PATH}.tmp`;
    try {
      await fs.writeFile(tempPath, JSON.stringify(this.shortcutList, null, 2), "utf-8");
      await fs.rename(tempPath, constants.SHORTCUT_LIST_PATH);
    } catch (error) {
      console.error("Failed to save shortcut list:", error);
      // Attempt to clean up the temporary file if it exists
      try {
        await fs.unlink(tempPath);
      } catch (cleanupError) {
        console.error("Failed to clean up temporary shortcut file:", cleanupError);
      }
    }
  }

  public getShortcuts(): Record<string, ShortcutProps> {
    return this.shortcutList;
  }

  public async addShortcut(shortcut: ShortcutProps): Promise<{ success: boolean; message: string }> {
    if (globalShortcut.isRegistered(shortcut.accelerator)) {
      const message = `Shortcut ${shortcut.accelerator} is already registered.`;
      console.log(message);
      return { success: false, message };
    }

    const success = utils.registerShortcut(shortcut, this.store);

    if (success) {
      this.shortcutList[shortcut.id] = shortcut;
      await this.saveShortcutList();
      return { success: true, message: "Shortcut registered successfully" };
    } else {
      const message = `Failed to register shortcut: ${shortcut.accelerator}. It might be an invalid combination.`;
      console.log(message);
      return { success: false, message };
    }
  }

  public async deleteShortcut(shortcutId: string): Promise<{ success: boolean; message: string }> {
    if (!shortcutId || !this.shortcutList[shortcutId]) {
      const message = "Invalid shortcut ID for deletion.";
      console.error(message, shortcutId);
      return { success: false, message };
    }

    const shortcutToDelete = this.shortcutList[shortcutId];
    
    globalShortcut.unregister(shortcutToDelete.accelerator);
    delete this.shortcutList[shortcutId];

    await this.saveShortcutList();
    
    console.log(`Shortcut ${shortcutToDelete.name} deleted and list saved.`);
    return { success: true, message: "Shortcut deleted successfully." };
  }
} 