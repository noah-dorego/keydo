import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Store from "electron-store";

import * as utils from "./utils.js";
import * as constants from "./constants.js";
import { ShortcutProps, Settings } from "./types.js";
import { ShortcutManager } from "./shortcut-manager.js";

const store = new Store<Settings>({
  defaults: {
    notificationBannersEnabled: true,
    notificationSoundsEnabled: true,
    launchOnStartup: false,
  },
});

let mainWindow: BrowserWindow | null;

const shortcutManager = new ShortcutManager(store);

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: utils.getPreloadPath(),
    },
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
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

  // Initialize launch on startup setting
  const launchOnStartup = store.get("launchOnStartup");
  app.setLoginItemSettings({
    openAtLogin: launchOnStartup,
    openAsHidden: true,
  });

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
    return shortcutManager.addShortcut(data);
  });

  ipcMain.handle("get-shortcuts", () => {
    return shortcutManager.getShortcuts();
  });

  ipcMain.handle("delete-shortcut", (event, shortcutId) => {
    return shortcutManager.deleteShortcut(shortcutId);
  });

  ipcMain.handle("settings:get", () => {
    return {
      notificationBannersEnabled: store.get("notificationBannersEnabled"),
      notificationSoundsEnabled: store.get("notificationSoundsEnabled"),
      launchOnStartup: store.get("launchOnStartup"),
    };
  });

  ipcMain.handle(
    "settings:update",
    (event, { key, value }: { key: keyof Settings; value: boolean }) => {
      store.set(key, value);
      
      // Handle launch on startup setting
      if (key === "launchOnStartup") {
        app.setLoginItemSettings({
          openAtLogin: value,
          openAsHidden: true, // Start minimized to tray
        });
      }
      
      return { success: true };
    }
  );

  ipcMain.handle("play-shortcut-sound", () => {
    // Send a message to the renderer process to play the sound
    if (mainWindow) {
      mainWindow.webContents.send("play-shortcut-sound");
    }
    return { success: true };
  });


});

// Do not quit when windows are closed, continue listening for shortcuts
app.on("window-all-closed", () => {});
