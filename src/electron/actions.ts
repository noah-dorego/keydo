import { spawn } from 'child_process';
import { shell } from 'electron';
import { clipboard } from 'electron';

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

export interface AIActionDetails {
  message: string;
}

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
        return { success: true, message: `Upper case text: ${upperCaseText}` };
      }
      case 'lowerCase': {
        const lowerCaseText = text.toLowerCase();
        return { success: true, message: `Lower case text: ${lowerCaseText}` };
      }
      case 'pasteText': {
        const textToPaste = "Get preset text from shortcut";
        return { success: true, message: `Pasted text: ${textToPaste}` };
      }
      default:
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

  static async executeAction(actionType: string, actionDetails: ActionDetails): Promise<{ success: boolean; message: string }> {
    switch (actionType) {
      case 'script':
        return await this.executeScript(actionDetails as ScriptActionDetails);
      case 'file':
        return await this.executeFile(actionDetails as FileActionDetails);
      case 'text':
        console.log('Text action not implemented yet.');
        return { success: false, message: 'Text action not implemented yet.' };
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
}

