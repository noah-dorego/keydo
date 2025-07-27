# Shortcut E2E Logic Documentation

This document describes the complete end-to-end logic for how shortcuts are added, removed, and handled in the Keydo application.

## Overview

The shortcut system consists of several key components:
- **Frontend**: React components for UI interaction
- **Electron Main Process**: Handles global shortcut registration and IPC communication
- **Electron Preload**: Exposes safe APIs to the renderer process
- **Utils**: Helper functions for shortcut management
- **Actions**: Execution logic for different action types

## Data Flow Architecture

```
Frontend (React) ↔ Preload Script ↔ Main Process (Electron) ↔ Global Shortcuts
                              ↓
                        File System (JSON)
```

## 1. Shortcut Addition Flow

### 1.1 Frontend - User Interface

The shortcut addition process starts in the frontend with the `AddShortcutModal` component:

**File**: `src/frontend/components/add-shortcut-modal.tsx`

```typescript
// Multi-step modal for creating shortcuts
export function AddShortcutModal({
  isOpen,
  onOpenChange,
  onShortcutAdded,
}: AddShortcutModalProps) {
  // Step 1: Choose action type (text, file, script, ai)
  // Step 2: Configure action details
  // Step 3: Define shortcut keys
  // Step 4: Name the shortcut
}
```

**Key Components**:
- **Action Type Selection**: Users choose between text manipulation, file operations, script execution, or AI actions
- **Shortcut Input**: Uses `ShortcutInput` component for key combination definition
- **Validation**: Ensures all required fields are completed

### 1.2 Shortcut Input Component

**File**: `src/frontend/components/shortcut-input.tsx`

```typescript
export function ShortcutInput({ shortcut, setShortcut }: ShortcutInputProps) {
  const [isListening, setIsListening] = useState(false);
  
  // Handles key press events to capture shortcut combinations
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Maps keyboard events to Key enum values
    // Supports modifiers (Ctrl, Shift, Alt) and main keys
  }, []);
}
```

**Features**:
- Real-time key capture with visual feedback
- Support for multiple modifiers (up to 4)
- Automatic key mapping to the `Key` enum
- Visual representation of captured keys

### 1.3 Key Enum and Mapping

**File**: `src/frontend/types.ts`

```typescript
export enum Key {
  Ctrl = "Ctrl",
  Shift = "Shift",
  Alt = "Alt",
  A = "A",
  B = "B",
  // ... all keys
}

export const keyMap: { [key: string]: Key } = {
  'Control': Key.Ctrl,
  'Shift': Key.Shift,
  // ... mapping from DOM events to Key enum
};
```

### 1.4 Frontend to Main Process Communication

**File**: `src/electron/preload.cts`

```typescript
electron.contextBridge.exposeInMainWorld("electron", {
  addShortcut: async (data: any) =>
    electron.ipcRenderer.invoke("add-shortcut", data),
});
```

**File**: `src/frontend/components/add-shortcut-modal.tsx`

```typescript
// Final submission step
const shortcutData = {
  id: Date.now().toString(),
  name: stepData.shortcutName,
  accelerator: shortcutString, // e.g., "Ctrl+Shift+P"
  actionType: stepData.actionType,
  actionDetails: actionDetails,
};

if (window.electron && typeof window.electron.addShortcut === 'function') {
  window.electron.addShortcut(shortcutData).then(() => {
    onShortcutAdded();
  });
}
```

### 1.5 Main Process - Shortcut Registration

**File**: `src/electron/main.ts`

```typescript
ipcMain.handle("add-shortcut", (event, data: ShortcutProps) => {
  console.log("adding shortcut: ", data);
  
  // Check if shortcut is already registered
  if (globalShortcut.isRegistered(data.accelerator)) {
    return { success: false, message: `Shortcut ${data.accelerator} is already registered.` };
  }

  // Register the shortcut with Electron's globalShortcut
  const success = utils.registerShortcut(
    data.accelerator,
    data.actionType,
    data.actionDetails
  );

  if (success) {
    // Store in memory and persist to file
    shortcutList[data.id] = data;
    utils.saveShortcutList(shortcutList);
    return { success: true, message: "Shortcut registered successfully" };
  } else {
    return { success: false, message: `Failed to register shortcut: ${data.accelerator}` };
  }
});
```

### 1.6 Utils - Shortcut Registration

**File**: `src/electron/utils.ts`

```typescript
export const registerShortcut = (
  accelerator: string,
  actionType: string,
  actionDetails: Record<string, any>
) => {
  try {
    globalShortcut.register(accelerator, () => {
      console.log(`Shortcut triggered: ${accelerator}, Action: ${actionType}`);
      ActionExecutor.executeAction(actionType, actionDetails);
    });
    console.log(`Shortcut registered: ${accelerator}`);
    return true;
  } catch (error) {
    console.log(`Error registering shortcut ${accelerator}:`, error);
    return false;
  }
};
```

### 1.7 Persistence

**File**: `src/electron/utils.ts`

```typescript
export function saveShortcutList(list: Record<string, ShortcutProps>) {
  fs.writeFileSync(SHORTCUT_LIST_PATH, JSON.stringify(list, null, 2));
}
```

## 2. Shortcut Removal Flow

### 2.1 Frontend - Delete UI

**File**: `src/frontend/components/shortcut-row.tsx`

```typescript
export function ShortcutRow({ id, keys, action, onDelete }: ShortcutRowProps) {
  const handleDelete = async () => {
    if (window.electron && typeof window.electron.deleteShortcut === "function") {
      const result = await window.electron.deleteShortcut(id);
      if (result.success) {
        onDelete(); // Refresh the shortcut list
      }
    }
  };
}
```

### 2.2 Main Process - Deletion Logic

**File**: `src/electron/main.ts`

```typescript
ipcMain.handle("delete-shortcut", (event, shortcutId) => {
  if (!shortcutId || !shortcutList[shortcutId]) {
    return { success: false, message: "Invalid shortcut ID." };
  }

  const shortcutToDelete = shortcutList[shortcutId];
  
  // Unregister from Electron's globalShortcut
  globalShortcut.unregister(shortcutToDelete.accelerator);

  // Remove from in-memory list
  delete shortcutList[shortcutId];

  // Persist the updated list
  try {
    fs.writeFileSync(constants.SHORTCUT_LIST_PATH, JSON.stringify(shortcutList, null, 2));
    return { success: true, message: "Shortcut deleted successfully." };
  } catch (error) {
    // Rollback on failure
    shortcutList[shortcutId] = shortcutToDelete;
    globalShortcut.register(shortcutToDelete.accelerator, () => {});
    return { success: false, message: "Failed to update shortcut file." };
  }
});
```

## 3. Shortcut Execution Flow

### 3.1 Global Shortcut Trigger

When a registered shortcut is pressed, Electron's `globalShortcut` automatically triggers the callback:

```typescript
globalShortcut.register(accelerator, () => {
  console.log(`Shortcut triggered: ${accelerator}, Action: ${actionType}`);
  ActionExecutor.executeAction(actionType, actionDetails);
});
```

### 3.2 Action Execution

**File**: `src/electron/actions.ts`

```typescript
export class ActionExecutor {
  static async executeAction(actionType: string, actionDetails: ActionDetails): Promise<{ success: boolean; message: string }> {
    switch (actionType) {
      case 'script':
        return await this.executeScript(actionDetails as ScriptActionDetails);
      case 'file':
        return await this.executeFile(actionDetails as FileActionDetails);
      case 'text':
        return await this.executeTextAction(actionDetails as TextActionDetails);
      case 'ai':
        return { success: false, message: 'AI action not implemented yet.' };
      default:
        return { success: false, message: `Unknown action type: ${actionType}` };
    }
  }
}
```

### 3.3 Action Types

#### Text Actions
```typescript
static async executeTextAction(actionDetails: TextActionDetails): Promise<{ success: boolean; message: string }> {
  const text = clipboard.readText();

  switch (actionDetails.actionType) {
    case 'charCount': {
      const charCount = text.length;
      return { success: true, message: `Character count: ${charCount}` };
    }
    case 'wordCount': {
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      return { success: true, message: `Word count: ${wordCount}` };
    }
    case 'upperCase': {
      const upperCaseText = text.toUpperCase();
      clipboard.writeText(upperCaseText);
      return { success: true, message: `Upper case text: ${upperCaseText}` };
    }
    case 'pasteText': {
      const textToPaste = "Get preset text from shortcut";
      clipboard.writeText(textToPaste);
      return { success: true, message: `Pasted text: ${textToPaste}` };
    }
  }
}
```

#### Script Actions
```typescript
static async executeScript(actionDetails: ScriptActionDetails): Promise<{ success: boolean; message: string }> {
  if (process.platform === 'win32') {
    const cmdProcess = spawn('cmd', ['/k', actionDetails.scriptPath], {
      detached: true,
      stdio: 'ignore'
    });
    cmdProcess.unref();
    return { success: true, message: 'Command prompt opened with script' };
  } else {
    const terminalProcess = spawn('sh', [actionDetails.scriptPath], {
      detached: true,
      stdio: 'ignore'
    });
    terminalProcess.unref();
    return { success: true, message: 'Terminal opened with script' };
  }
}
```

#### File Actions
```typescript
static async executeFile(actionDetails: FileActionDetails): Promise<{ success: boolean; message: string }> {
  try {
    await shell.openPath(actionDetails.filePath);
    return { success: true, message: 'File opened successfully' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}
```

## 4. Application Startup and Persistence

### 4.1 Startup Shortcut Loading

**File**: `src/electron/main.ts`

```typescript
app.whenReady().then(() => {
  // Load shortcuts from file on startup
  if (fs.existsSync(constants.SHORTCUT_LIST_PATH)) {
    try {
      const rawData = fs.readFileSync(constants.SHORTCUT_LIST_PATH, "utf-8");
      shortcutList = JSON.parse(rawData);
      
      // Re-register all shortcuts from the list on startup
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
  }
});
```

### 4.2 Data Structure

**File**: `src/electron/types.ts`

```typescript
export type ShortcutProps = {
  id: string;
  name: string;
  accelerator: string; // e.g., "Ctrl+Shift+P"
  actionType: string;  // "text", "file", "script", "ai"
  actionDetails: Record<string, ActionParams>;
};
```

## 5. Frontend Display and Management

### 5.1 Shortcut List Component

**File**: `src/frontend/components/shortcut-list.tsx`

```typescript
export function ShortcutList() {
  const [shortcuts, setShortcuts] = useState<ShortcutProps[]>([]);

  const fetchShortcuts = async () => {
    try {
      const shortcutListObj = await window.electron.getShortcutList();
      if (shortcutListObj && typeof shortcutListObj === "object") {
        const shortcutsArray = Object.values(shortcutListObj) as ShortcutProps[];
        setShortcuts(shortcutsArray);
      }
    } catch (error) {
      console.error("Error fetching shortcuts:", error);
      setShortcuts([]);
    }
  };
}
```

### 5.2 Accelerator Parsing

```typescript
const parseAcceleratorToKeys = (accelerator: string): Key[] => {
  if (!accelerator) return [];
  return accelerator
    .split("+")
    .map((part) => {
      const keyEnum = Key[part as keyof typeof Key];
      if (keyEnum) {
        return keyEnum;
      }
      // Fallback for single characters
      if (part.length === 1 && Key[part.toUpperCase() as keyof typeof Key]) {
        return Key[part.toUpperCase() as keyof typeof Key];
      }
      return part as Key;
    })
    .filter(Boolean) as Key[];
};
```

## 6. Error Handling and Validation

### 6.1 Duplicate Shortcut Prevention
- Checks if shortcut is already registered before adding
- Returns error message if duplicate detected

### 6.2 Invalid Shortcut Validation
- Electron's `globalShortcut.register()` validates accelerator format
- Returns false if invalid combination provided

### 6.3 File System Error Handling
- Try-catch blocks around file operations
- Rollback mechanisms for failed deletions
- Graceful fallbacks for missing files

### 6.4 IPC Error Handling
- Frontend checks for function availability before calling
- Error messages returned to frontend for user feedback
- Console logging for debugging

## 7. Security Considerations

### 7.1 Preload Script Security
- Only necessary functions exposed to renderer process
- No direct access to Node.js APIs from frontend

### 7.2 File Path Validation
- Script and file paths should be validated before execution
- Consider sandboxing for script execution

### 7.3 Input Sanitization
- Shortcut names and action details should be validated
- Prevent injection attacks through shortcut data

## 8. Performance Considerations

### 8.1 Memory Management
- Shortcuts stored in memory for fast access
- File I/O only on add/delete operations

### 8.2 Global Shortcut Efficiency
- Electron's `globalShortcut` is optimized for system-level performance
- Minimal overhead for registered shortcuts

### 8.3 UI Responsiveness
- Async operations for file I/O
- Non-blocking shortcut registration
- Background script execution

This documentation provides a comprehensive overview of the shortcut system's end-to-end logic, from user interface to system-level execution. 