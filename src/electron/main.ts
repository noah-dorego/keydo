import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";

import * as utils from "./utils.js";
import * as constants from "./constants.js";
import { ShortcutProps } from "./types.js";

let mainWindow: BrowserWindow | null;

let shortcutList: Record<string, ShortcutProps> = {};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: utils.getPreloadPath(),
    },
    minWidth: 500,
    minHeight: 600,
  });

  // Load from hosted port in dev mode, and from build in prod
  if (utils.isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Get list of shortvuts from file (if exists)
  if (fs.existsSync(constants.SHORTCUT_LIST_PATH)) {
    try {
      const rawData = fs.readFileSync(constants.SHORTCUT_LIST_PATH, "utf-8");
      shortcutList = JSON.parse(rawData);
      // Re-register all shortcuts from the list on startup.
      for (const id in shortcutList) {
        const shortcut = shortcutList[id];
        if (shortcut) {
          utils.registerShortcut(
            shortcut.accelerator,
            shortcut.actionType,
            shortcut.actionDetails
          );
        }
      }
    } catch (error) {
      console.log("unable to read file: ", error);
    }
  } else {
    console.log("file doesn't exist");
    fs.writeFileSync(constants.SHORTCUT_LIST_PATH, "{}");
  }

  globalShortcut.register(constants.startCommand, () => {
    if (!mainWindow) {
      createWindow();
    }
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Define IPC event handlers
  ipcMain.handle("add-shortcut", (event, data: ShortcutProps) => {
    console.log("adding shortcut: ", data);
    if (globalShortcut.isRegistered(data.accelerator)) {
      const message = `Shortcut ${data.accelerator} is already registered.`;
      console.log(message);
      return { success: false, message };
    }

    const success = utils.registerShortcut(
      data.accelerator,
      data.actionType,
      data.actionDetails
    );

    if (success) {
      shortcutList[data.id] = data;
      utils.saveShortcutList(shortcutList);
      return { success: true, message: "Shortcut registered successfully" };
    } else {
      const message = `Failed to register shortcut: ${data.accelerator}. It might be an invalid combination.`;
      console.log(message);
      return { success: false, message };
    }
  });

  ipcMain.handle("get-shortcuts", () => {
    return shortcutList;
  });

  ipcMain.handle("delete-shortcut", (event, shortcutId) => {
    if (!shortcutId || !shortcutList[shortcutId]) {
      console.error("Invalid shortcut ID for deletion:", shortcutId);
      return { success: false, message: "Invalid shortcut ID." };
    }

    const shortcutToDelete = shortcutList[shortcutId];
    
    // Unregister from Electron
    globalShortcut.unregister(shortcutToDelete.accelerator);

    // Remove from in-memory list
    delete shortcutList[shortcutId];

    // Persist the updated list
    try {
      fs.writeFileSync(constants.SHORTCUT_LIST_PATH, JSON.stringify(shortcutList, null, 2));
      console.log(`Shortcut ${shortcutToDelete.name} deleted and list saved.`);
    } catch (error) {
      console.error("Failed to save shortcut list after deletion:", error);
      // If saving fails, you might want to rollback the in-memory deletion
      // For simplicity here, we'll just log the error.
      shortcutList[shortcutId] = shortcutToDelete; // Rollback
      globalShortcut.register(shortcutToDelete.accelerator, () => {}); // Re-register (action is lost)
      return { success: false, message: "Failed to update shortcut file." };
    }

    return { success: true, message: "Shortcut deleted successfully." };
  });
});

// Do not quit when windows are closed, continue listening for shortcuts
app.on("window-all-closed", () => {});
