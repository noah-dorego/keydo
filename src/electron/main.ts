import { app, globalShortcut, BrowserWindow } from "electron";
import path from "path";

import { Key } from "./types.js";

import { constants, registerShortcut } from "./constants.js";
import { isDev } from "./utils.js";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({});

  // Load from hosted port in dev mode, and from build in prod
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  globalShortcut.register(constants.startCommand.join("+"), () => {
    createWindow();
  });

  registerShortcut([Key.Alt, Key.A], () => console.log("hello vro"));

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Do not quit when windows are closed, continue listening for shortcuts
app.on("window-all-closed", () => {});
