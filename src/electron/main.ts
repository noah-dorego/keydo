import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";

import * as utils from "./utils.js";
import * as constants from "./constants.js";

let mainWindow: BrowserWindow | null;

let shortcutList = {};

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
    console.log("adding shortcut: ", data);
    utils.registerShortcut(data.accelerator, data.actionType);
    // write to file
    return "adding event";
  });

  ipcMain.handle("get-shortcuts", () => {
    return shortcutList;
  });
});

// Do not quit when windows are closed, continue listening for shortcuts
app.on("window-all-closed", () => {});
