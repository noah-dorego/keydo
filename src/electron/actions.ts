import { spawn } from 'child_process';
import { shell } from 'electron';
import { clipboard } from 'electron';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { FILE_ORGANIZATION_EXTENSIONS } from './constants.js';

// Define action detail types for better type safety
export interface ScriptActionDetails {
  scriptPath: string;
}

export interface TextActionDetails {
  actionType: string;
}

export interface FileActionDetails {
  filePath: string;
}

export interface WebsiteActionDetails {
  websiteUrl: string;
}

export interface BasicActionDetails {
  actionType: string;
  websiteUrl?: string;
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
        return { success: true, message: `Word count: ${wordCount}` };
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
        const textToPaste = "Get preset text from shortcut";
        clipboard.writeText(textToPaste);
        return { success: true, message: `Pasted text: ${textToPaste}` };
      }
      default:
        console.log('Unknown text action type: ', actionDetails.actionType);
        return { success: false, message: 'Unknown text action type' };
    }
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
    if (!actionDetails.filePath) {
      const errorMsg = 'File path is not provided.';
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      // Use shell.openPath to open the file with the default application
      await shell.openPath(actionDetails.filePath);
      return { success: true, message: 'File opened successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to open file: ${message}`);
      return { success: false, message };
    }
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

  static async executeAction(actionType: string, actionDetails: ActionDetails): Promise<{ success: boolean; message: string }> {
    console.log('Executing action: ', actionType, actionDetails);

    switch (actionType) {
      case 'script':
        return await this.executeScript(actionDetails as ScriptActionDetails);
      case 'file':
        return await this.executeFile(actionDetails as FileActionDetails);
      case 'text':
        return await this.executeTextAction(actionDetails as TextActionDetails);
      case 'basic':
        return await this.executeBasicAction(actionDetails as BasicActionDetails);
      case 'fileOrganization':
        return await this.executeFileOrganization(actionDetails as FileOrganizationDetails);
      case 'ai':
        console.log('AI action not implemented yet.');
        return { success: false, message: 'AI action not implemented yet.' };
      default: {
        const errorMsg = `Unknown action type: ${actionType}`;
        console.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    }
  }

  static async executeBasicAction(actionDetails: BasicActionDetails): Promise<{ success: boolean; message: string }> {
    const { actionType, websiteUrl } = actionDetails;
    
    switch (actionType) {
      case 'openWebsite':
        if (!websiteUrl) {
          return { success: false, message: 'Website URL is required for openWebsite action' };
        }
        return await this.executeWebsite({ websiteUrl });
      case 'organizeDesktop':
        console.log('Organizing desktop...');
        return await this.executeFileOrganization({});
      case 'closeWindows':
        console.log('Close windows action not implemented yet.');
        return { success: false, message: 'Close windows action not implemented yet.' };
      default: {
        const errorMsg = `Unknown basic action type: ${actionType}`;
        console.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    }
  }
}

