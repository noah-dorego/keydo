import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import path from "path";

import { Key } from "./types.js";

import * as utils from "./utils.js";
import * as constants from "./constants.js";

let mainWindow: BrowserWindow | null;

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

  globalShortcut.register(constants.startCommand.join("+"), () => {
    if (!mainWindow) {
      createWindow();
    }
  });

  utils.registerShortcut([Key.Alt, Key.A], "testName");

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Define IPC event handlers
  ipcMain.handle("add-shortcut", (event, data) => {
    console.log("adding shortcut test");
    utils.registerShortcut(data.command, data.action);
    return "adding event";
  });
});

// Do not quit when windows are closed, continue listening for shortcuts
app.on("window-all-closed", () => {});
