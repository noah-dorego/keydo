# Keydo Brainstorming

This document outlines key considerations for building a user-specified shortcut application with Electron.

## 1. Storing User-Inputted Shortcuts

### Method & Format:
*   **File-Based Storage**: Use `app.getPath('userData')` for storing configuration files.
*   **Format**: JSON is recommended due to its readability and ease of use with JavaScript/TypeScript.

### Suggested JSON Structure for Shortcuts:
```json
[
  {
    "id": "unique-shortcut-id",
    "name": "User-Friendly Name",
    "accelerator": "CommandOrControl+Shift+K", // Electron globalShortcut format
    "actionType": "predefinedAction", // Crucial for security
    "actionDetails": {
      // Parameters specific to the actionType
      "param1": "value1"
    }
  }
]
```
*   **`id`**: Unique identifier (e.g., UUID).
*   **`name`**: Display name for the user.
*   **`accelerator`**: Key combination string for `globalShortcut.register()`.
*   **`actionType`**: A string/enum categorizing the action (e.g., `openPath`, `runCommand`, `manipulateText`). This is key for security, as it maps to predefined, safe functions.
*   **`actionDetails`**: Object containing parameters for the specific `actionType`.

### Key Considerations for Storage:
*   **Validation**: Rigorously validate all user input (accelerator format, known `actionType`s, required `actionDetails`).
*   **Error Handling**: Implement robust error handling for file I/O.
*   **Unregistering Shortcuts**: Use `globalShortcut.unregister()` for deleted/modified shortcuts and `globalShortcut.unregisterAll()` on app quit or before re-registering.

## 2. Safest Way to Run Shortcuts (Security)

This is the most critical aspect. **Never directly execute raw user-provided code/commands.**

### Core Principle: Pre-defined & Parameterized Actions
*   **Avoid `eval()` and direct `exec()`/`spawn()` with raw user strings.**
*   The user selects an `actionType` from a list *you* provide and configures its `actionDetails` (parameters).
*   Your main process maps `actionType` to specific, trusted functions.

### Action Dispatcher in Main Process:
```typescript
// Simplified example in electron/main.ts
function handleShortcutAction(shortcut: YourShortcutType) {
  const { actionType, actionDetails } = shortcut;
  switch (actionType) {
    case 'openPath':
      // Safely use shell.openPath(actionDetails.path)
      // Ensure path is validated/sanitized if necessary
      break;
    case 'runPredefinedCommand':
      // Map actionDetails.commandAlias to a specific, hardcoded command
      // Use spawn('hardcoded-command', [validatedParam1, validatedParam2])
      break;
    // ... other safe action types
  }
}
```

### `child_process.spawn()` vs. `child_process.exec()`:
*   **Prefer `spawn()`**: It does not use a shell by default, making it safer from shell injection if you pass command and arguments as an array.
*   Avoid `exec()` or `spawn({ shell: true })` with un-sanitized user input.

### Regex Actions:
*   User-defined regex for text manipulation is generally safe from OS-level code execution.
*   **Beware of ReDoS (Regular Expression Denial of Service)**. Consider limiting complexity or using libraries with timeout/ReDoS protection.

## 3. Scope of Shortcuts & OS-Level Functionality

Electron provides significant access to system functionalities via Node.js and its own APIs.

### Native Capabilities (Main Process):
*   **File System**: Full access (`fs` module).
*   **Child Processes**: Launch external apps/scripts (`child_process`).
*   **Electron APIs**: `globalShortcut`, `shell`, `clipboard`, `dialog`, `BrowserWindow`, `ipcMain`/`ipcRenderer`.

### "Low-Level" Access:
*   **Standard Electron/Node.js**: Sufficient for common automation, file management, launching apps, text manipulation (clipboard, within your app).
*   **Interacting with *other* applications (e.g., manipulate selected text in another app, global mouse/keyboard hooks beyond `globalShortcut`)**:
    *   Requires OS-specific accessibility APIs or simulating inputs.
    *   **Native Addons (N-API)**: Write in C++/Rust (e.g., `robotjs`) for deep OS integration. This adds complexity but unlocks powerful capabilities.

### Security & Permissions:
*   Electron apps run with the user's privileges.
*   Renderer processes are sandboxed; privileged operations must be delegated to the main process via IPC.

## 4. Other Key Considerations

*   **User Experience (UX)**:
    *   How will users define shortcuts? A clear, intuitive UI is essential.
    *   Provide feedback when shortcuts are registered or fail.
    *   How will users discover available `actionType`s and their parameters?
    *   Consider an "edit" mode for existing shortcuts.
*   **Error Handling & Logging**:
    *   Robust error handling for all operations (file I/O, IPC, action execution).
    *   Logging (to console or a file) for debugging and troubleshooting.
*   **Asynchronous Operations**: Most file system, IPC, and child process operations are asynchronous. Manage promises and async/await correctly.
*   **Conflict Resolution**: How will you handle if a user tries to register a shortcut already in use by the OS or another application? `globalShortcut.isRegistered()` can help, but it's not foolproof for external conflicts. Clearly communicate failures.
*   **Cross-Platform Compatibility**:
    *   Be mindful of differences in path formats, common keyboard shortcuts (e.g., `Cmd` vs. `Ctrl`), and available shell commands if `actionType` involves them.
    *   Electron helps abstract many OS differences, but diligence is needed.
*   **Performance**:
    *   If many shortcuts are registered, ensure efficient lookup and dispatch.
    *   Avoid blocking the main process.
*   **Pre-computation/Caching**: Reading the shortcut file and parsing it on every shortcut trigger might be inefficient. Load and parse it once at startup and update the in-memory representation when changes are made. Your current approach in `main.ts` of loading `shortcutList` at startup is good.
*   **Backup & Restore**: For valuable user configurations, consider offering a way to backup and restore their shortcut list.
*   **Extensibility**: Design with future `actionType`s in mind. A clear separation of concerns will make it easier to add new functionalities.

This should provide a solid foundation for your project planning!
