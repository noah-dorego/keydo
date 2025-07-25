import { spawn } from 'child_process';
import { app, shell, clipboard, Notification, BrowserWindow, screen } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Store from 'electron-store';
import { FILE_ORGANIZATION_EXTENSIONS } from './constants.js';
import { ShortcutProps, Settings } from './types.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define action detail types for better type safety
export interface ScriptActionDetails {
  scriptPath: string;
}

export interface TextActionDetails {
  actionType: string;
  pasteText?: string;
}

export interface FileActionDetails {
  actionType: string;
  path: string;
}

export interface WebsiteActionDetails {
  websiteUrl: string;
}

export interface BasicActionDetails {
  actionType: string;
  websiteUrl?: string;
  websites?: string[]; // Array of website URLs for multiple websites
  applicationPath?: string;
  applications?: string[]; // Array of application paths for multiple applications
}

export interface AIActionDetails {
  message: string;
}

export interface FileOrganizationDetails {
  sourcePath?: string; // Optional, defaults to desktop
  extensions?: Record<string, string>; // e.g., { '.pdf': 'Documents', '.jpg': 'Images' }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionDetails = Record<string, any>;

export class ActionExecutor {
  static async executeTextAction(actionDetails: TextActionDetails): Promise<{ success: boolean; message: string }> {
    const text = clipboard.readText();

    switch (actionDetails.actionType) {
      case 'charCount': {
        const charCount = text.length;
        return { success: true, message: `Character count: ${charCount}` };
      }
      case 'wordCount': {
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const charCount = text.length;
        await this.showWordCountPopup(wordCount, charCount);
        return { success: true, message: `Word count: ${wordCount}, Character count: ${charCount}` };
      }
      case 'upperCase': {
        const upperCaseText = text.toUpperCase();
        console.log('Upper case text: ', upperCaseText);
        clipboard.writeText(upperCaseText);
        return { success: true, message: `Upper case text: ${upperCaseText}` };
      }
      case 'titleCase': {
        const titleCaseText = text.toLowerCase();
        clipboard.writeText(titleCaseText);
        return { success: true, message: `Title case text: ${titleCaseText}` };
      }
      case 'pasteText': {
        const textToPaste = actionDetails.pasteText;

        if (textToPaste === undefined) {
          const errorMessage = 'No text provided for pasteText action.';
          console.log(errorMessage);
          return { success: false, message: errorMessage };
        }

        clipboard.writeText(textToPaste);
        return { success: true, message: `Pasted text: ${textToPaste}` };
      }
      default:
        console.log('Unknown text action type: ', actionDetails.actionType);
        return { success: false, message: 'Unknown text action type' };
    }
  }

  static async showWordCountPopup(wordCount: number, charCount: number): Promise<void> {
    // Create a new popup window
    const popupWindow = new BrowserWindow({
      width: 450,
      height: 300,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.cjs'),
      }
    });

    // Load the popup HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Text Analysis</title>
          <style>
            body {
              margin: 0;
              padding: 24px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
              color: #1f2937;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
              user-select: none;
              overflow: hidden;
            }
            .container {
              text-align: center;
            }
            .title {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 24px;
              color: #111827;
            }
            .stats-container {
              display: flex;
              gap: 16px;
              justify-content: center;
              margin-bottom: 20px;
            }
            .stat-card {
              flex: 1;
              padding: 16px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 8px;
              font-weight: 500;
            }
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #111827;
            }
            .close-btn {
              width: 100%;
              padding: 8px 16px;
              background: #f3f4f6;
              border: 1px solid #e5e7eb;
              color: #6b7280;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
            }
            .close-btn:hover {
              background: #e5e7eb;
              color: #374151;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title">📊 Text Analysis</div>
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-label">Words</div>
                <div class="stat-value">${wordCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Characters</div>
                <div class="stat-value">${charCount}</div>
              </div>
            </div>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `;

    // Load the HTML content
    popupWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    // Position the window in the center of the screen
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const windowBounds = popupWindow.getBounds();
    
    popupWindow.setPosition(
      Math.round((width - windowBounds.width) / 2),
      Math.round((height - windowBounds.height) / 2)
    );
  }

  static async executeScript(actionDetails: ScriptActionDetails): Promise<{ success: boolean; message: string }> {
    if (!actionDetails.scriptPath) {
      const errorMsg = 'Script path is not provided.';
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      // On Windows, open a command prompt with the script path
      // This is more reliable in packaged Electron apps
      if (process.platform === 'win32') {
        // Use cmd /k to keep the window open after execution
        const cmdProcess = spawn('cmd', ['/k', actionDetails.scriptPath], {
          detached: true,
          stdio: 'ignore'
        });
        
        // Don't wait for the process to finish
        cmdProcess.unref();

        console.log('Terminal opened with script');
        
        return { success: true, message: 'Command prompt opened with script' };
      } else {
        // On other platforms, use terminal
        const terminalProcess = spawn('sh', [actionDetails.scriptPath], {
          detached: true,
          stdio: 'ignore'
        });
        
        terminalProcess.unref();

        
        return { success: true, message: 'Terminal opened with script' };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to execute script: ${message}`);
      return { success: false, message };
    }
  }

  static async executeFile(actionDetails: FileActionDetails): Promise<{ success: boolean; message: string }> {
    if (!actionDetails.path) {
      const errorMsg = 'Path is not provided.';
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    switch (actionDetails.actionType) {
      case 'openFile':
      case 'openDirectory': // shell.openPath works for directories too
        try {
          await shell.openPath(actionDetails.path);
          return { success: true, message: 'Path opened successfully' };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error(`Failed to open path: ${message}`);
          return { success: false, message };
        }
      
      case 'openTerminal':
        try {
          // Check if the directory exists
          if (!fs.existsSync(actionDetails.path) || !fs.statSync(actionDetails.path).isDirectory()) {
            return { success: false, message: `Directory not found at path: ${actionDetails.path}` };
          }
          
          if (process.platform === 'win32') {
            spawn('cmd.exe', ['/c', 'start'], { cwd: actionDetails.path, detached: true, stdio: 'ignore' }).unref();
          } else if (process.platform === 'darwin') {
            spawn('open', ['-a', 'Terminal', actionDetails.path], { detached: true, stdio: 'ignore' }).unref();
          } else {
            // Assume other Unix-like systems
            spawn('x-terminal-emulator', { cwd: actionDetails.path, detached: true, stdio: 'ignore' }).unref();
          }
          return { success: true, message: `Terminal opened at ${actionDetails.path}` };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return { success: false, message: `Failed to open terminal: ${message}` };
        }
      
      default:
        return { success: false, message: `Unknown file action type: ${actionDetails.actionType}` };
    }
  }

  static async executeMultipleApplications(applications: string[]): Promise<{ success: boolean; message: string }> {
    if (!applications || applications.length === 0) {
      return { success: false, message: 'No applications provided' };
    }

    let successCount = 0;
    const failedApplications: string[] = [];

    for (const appPath of applications) {
      try {
        await shell.openPath(appPath);
        successCount++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Failed to open application "${appPath}": ${message}`);
        failedApplications.push(`${appPath}: ${message}`);
      }
    }

    const totalApplications = applications.length;
    const resultMessage = `Attempted to open ${totalApplications} applications. Successfully opened ${successCount}. Failed: ${failedApplications.length}.`;
    
    if (failedApplications.length > 0) {
      console.warn('Failed to open applications:', failedApplications);
    }
    
    return { success: successCount > 0, message: resultMessage };
  }

  static async executeWebsite(actionDetails: WebsiteActionDetails): Promise<{ success: boolean; message: string }> {
    if (!actionDetails.websiteUrl) {
      const errorMsg = 'Website URL is not provided.';
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      // Use shell.openExternal to open the URL in the default browser
      await shell.openExternal(actionDetails.websiteUrl);
      return { success: true, message: 'Website opened successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to open website: ${message}`);
      return { success: false, message };
    }
  }

  static async executeMultipleWebsites(websites: string[]): Promise<{ success: boolean; message: string }> {
    if (!websites || websites.length === 0) {
      return { success: false, message: 'No websites provided' };
    }

    let successCount = 0;
    const failedWebsites: string[] = [];

    for (const websiteUrl of websites) {
      try {
        await shell.openExternal(websiteUrl);
        successCount++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Failed to open website "${websiteUrl}": ${message}`);
        failedWebsites.push(`${websiteUrl}: ${message}`);
      }
    }

    const totalWebsites = websites.length;
    const resultMessage = `Attempted to open ${totalWebsites} websites. Successfully opened ${successCount}. Failed: ${failedWebsites.length}.`;
    
    if (failedWebsites.length > 0) {
      console.warn('Failed to open websites:', failedWebsites);
    }
    
    return { success: successCount > 0, message: resultMessage };
  }

  static async executeFileOrganization(actionDetails: FileOrganizationDetails): Promise<{ success: boolean; message: string }> {
    try {
      // Get desktop path
      let desktopPath: string;

      if (process.platform === 'win32') {
        // On Windows, try multiple approaches to find the desktop
        const possiblePaths = [
          path.join(app.getPath('home'), 'Desktop'),
          path.join(process.env.USERPROFILE || '', 'Desktop'),
          path.join(process.env.ONEDRIVE || '', 'Desktop'),
          path.join(process.env.ONEDRIVE || '', 'OneDrive', 'Desktop')
        ];

        // Find the first path that exists
        desktopPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
        console.log('Desktop path found:', desktopPath);
      } else {
        // On other platforms, use the standard approach
        desktopPath = path.join(app.getPath('home'), 'Desktop');
      }

      const sourcePath = actionDetails.sourcePath || desktopPath;
      
      // Default extensions mapping if none provided
      const extensions = actionDetails.extensions || FILE_ORGANIZATION_EXTENSIONS;

      // Read all files in the source directory
      const files = fs.readdirSync(sourcePath);
      let movedCount = 0;
      const errors: string[] = [];

      for (const file of files) {
        const filePath = path.join(sourcePath, file);
        const stats = fs.statSync(filePath);
        
        // Skip directories
        if (stats.isDirectory()) continue;
        
        const ext = path.extname(file).toLowerCase();
        const targetFolder = extensions[ext];
        
        if (targetFolder) {
          const targetPath = path.join(sourcePath, targetFolder);
          
          // Create target folder if it doesn't exist
          if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
          }
          
          // Move the file
          const newFilePath = path.join(targetPath, file);
          
          // Handle duplicate filenames
          let finalPath = newFilePath;
          let counter = 1;
          while (fs.existsSync(finalPath)) {
            const nameWithoutExt = path.parse(file).name;
            const ext = path.extname(file);
            finalPath = path.join(targetPath, `${nameWithoutExt}_${counter}${ext}`);
            counter++;
          }
          
          fs.renameSync(filePath, finalPath);
          movedCount++;
        }
      }

      const message = `Successfully organized ${movedCount} files.`;
      if (errors.length > 0) {
        console.warn('Some files could not be moved:', errors);
      }
      
      return { success: true, message };
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to organize files: ${message}`);
      return { success: false, message };
    }
  }

  static async executeAction(
    { name, actionType, actionDetails }: ShortcutProps,
    store: Store<Settings>
  ): Promise<{ success: boolean; message: string }> {
    console.log('Executing action: ', actionType, actionDetails);

    const actionMap: Record<
      string,
      (details: ActionDetails) => Promise<{ success: boolean; message: string }>
    > = {
      script: this.executeScript.bind(this) as (
        details: ActionDetails
      ) => Promise<{ success: boolean; message: string }>,
      file: this.executeFile.bind(this) as (
        details: ActionDetails
      ) => Promise<{ success: boolean; message: string }>,
      text: this.executeTextAction.bind(this) as (
        details: ActionDetails
      ) => Promise<{ success: boolean; message: string }>,
      basic: this.executeBasicAction.bind(this) as (
        details: ActionDetails
      ) => Promise<{ success: boolean; message: string }>,
      fileOrganization: this.executeFileOrganization.bind(this) as (
        details: ActionDetails
      ) => Promise<{ success: boolean; message: string }>,
      ai: async () => {
        console.log('AI action not implemented yet.');
        return { success: false, message: 'AI action not implemented yet.' };
      },
    };

    const action = actionMap[actionType];
    let result: { success: boolean; message: string };

    if (action) {
      result = await action(actionDetails);
    } else {
      const errorMsg = `Unknown action type: ${actionType}`;
      console.error(errorMsg);
      result = { success: false, message: errorMsg };
    }

    if (store.get('notificationBannersEnabled')) {
      // Show notification after action completes
      const NOTIFICATION_TITLE = `${name}`;
      const NOTIFICATION_BODY = result.success
        ? 'Shortcut executed successfully!'
        : `Error: ${result.message}`;

      new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
      }).show();
    }

    // Play sound via IPC to frontend
    try {
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        windows[0].webContents.send('play-shortcut-sound');
      }
    } catch (error) {
      console.warn('Failed to trigger sound via IPC:', error);
    }

    return result;
  }

  static async executeBasicAction(actionDetails: BasicActionDetails): Promise<{ success: boolean; message: string }> {
    const { actionType, websiteUrl, websites, applicationPath, applications } = actionDetails;
    
    const basicActionMap: Record<string, () => Promise<{ success: boolean; message: string }>> = {
      openWebsite: async () => {
        if (websites && websites.length > 0) {
          return await this.executeMultipleWebsites(websites);
        } else if (websiteUrl) {
          return await this.executeMultipleWebsites([websiteUrl]);
        } else {
          return { success: false, message: 'Website URL(s) are required for openWebsite action' };
        }
      },
      openApplications: async () => {
        if (applications && applications.length > 0) {
          return await this.executeMultipleApplications(applications);
        } else if (applicationPath) {
          return await this.executeFile({ actionType: 'openFile', path: applicationPath });
        } else {
          return { success: false, message: 'Application path(s) are required for openApplications action' };
        }
      },
      organizeDesktop: async () => {
        console.log('Organizing desktop...');
        return await this.executeFileOrganization({});
      },
      closeWindows: async () => {
        console.log('Close windows action not implemented yet.');
        return { success: false, message: 'Close windows action not implemented yet.' };
      },
    };

    const action = basicActionMap[actionType];

    if (action) {
      return await action();
    } else {
      const errorMsg = `Unknown basic action type: ${actionType}`;
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  }
}

