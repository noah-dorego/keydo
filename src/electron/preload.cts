const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getShortcutList: () => electron.ipcRenderer.invoke("get-shortcuts"),
  addShortcut: async (data: any) =>
    electron.ipcRenderer.invoke("add-shortcut", data),
});
