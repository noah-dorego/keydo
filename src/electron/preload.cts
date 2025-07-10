const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getShortcutList: () => electron.ipcRenderer.invoke("get-shortcuts"),
  addShortcut: async (data: any) =>
    electron.ipcRenderer.invoke("add-shortcut", data),
  deleteShortcut: (shortcutId: string) =>
    electron.ipcRenderer.invoke("delete-shortcut", shortcutId),
  playShortcutSound: () => electron.ipcRenderer.invoke("play-shortcut-sound"),
  onPlayShortcutSound: (callback: () => void) =>
    electron.ipcRenderer.on("play-shortcut-sound", callback),
});
