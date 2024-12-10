import { app, globalShortcut, BrowserWindow } from "electron";
import path from "path";

import { Key } from "./types.js";

import { registerShortcut } from "./methods.js";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({});

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  const startCommand = [Key.Alt, Key.CommandOrControl, Key.X];
  globalShortcut.register(startCommand.join("+"), () => {
    console.log("Electron loves global shortcuts!");
    createWindow();
  });

  registerShortcut([Key.Alt, Key.A], () => console.log("hello vro"));

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
