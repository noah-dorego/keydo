import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";

import * as utils from "./utils.js";
import * as constants from "./constants.js";

let mainWindow: BrowserWindow | null;

interface ShortcutData {
  id: string;
  name: string;
  accelerator: string;
  actionType: string;
  actionDetails: {
    filePath?: string;
    [key: string]: unknown; 
  };
}

let shortcutList: { [key: string]: ShortcutData } = {};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: utils.getPreloadPath(),
    },
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
      shortcutList = JSON.parse(
        fs.readFileSync(constants.SHORTCUT_LIST_PATH, "utf-8")
      );
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

  utils.registerShortcut("Alt+A", "testName");

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Define IPC event handlers
  ipcMain.handle("add-shortcut", (event, data) => {
    console.log("Received shortcut data in main process: ", data);

    // Ensure data and data.id exist
    if (!data || !data.id) {
      console.error("Invalid shortcut data received.", data);
      return { success: false, message: "Invalid shortcut data." };
    }

    // Add/update the shortcut in our in-memory list
    shortcutList[data.id] = data;

    // Persist the updated shortcut list to the file
    try {
      fs.writeFileSync(constants.SHORTCUT_LIST_PATH, JSON.stringify(shortcutList, null, 2));
      console.log("Shortcut list saved to file.");
    } catch (error) {
      console.error("Failed to save shortcut list to file:", error);
      // Optionally, return an error or decide if the in-memory registration should still proceed
      return { success: false, message: "Failed to save shortcut to file." };
    }

    // Register the shortcut for the current session
    // For now, the action will just be a console log
    const isRegistered = globalShortcut.register(data.accelerator, () => {
      console.log(`Shortcut ${data.accelerator} triggered! Action: ${data.actionType}, Details: ${JSON.stringify(data.actionDetails)}`);
      // Later, this will call a function to execute the script or perform the defined action
      if (data.actionType === "run_script" && data.actionDetails && data.actionDetails.filePath) {
        console.log(`Would execute script: ${data.actionDetails.filePath}`);
        // Placeholder for actual script execution logic
        // For example: utils.executeScript(data.actionDetails.filePath);
      }
    });

    if (!isRegistered) {
      console.error(`Failed to register shortcut: ${data.accelerator}`);
      // Optionally, remove from shortcutList and file if registration fails, or inform the user.
      return { success: false, message: `Failed to register shortcut: ${data.accelerator}. It might be already in use by another application.` };
    }

    console.log(`Shortcut ${data.accelerator} registered successfully.`);
    return { success: true, message: "Shortcut added and registered successfully." };
  });

  ipcMain.handle("get-shortcuts", () => {
    return shortcutList;
  });
});

// Do not quit when windows are closed, continue listening for shortcuts
app.on("window-all-closed", () => {});
