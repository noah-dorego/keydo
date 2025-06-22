import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class ActionExecutor {
  static async executeScript(actionDetails: { scriptPath: string }): Promise<{ success: boolean; message: string }> {
    if (!actionDetails.scriptPath) {
      const errorMsg = 'Script path is not provided.';
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      // On Windows, we execute the script directly. This works for executables (.exe)
      // and batch files (.bat, .cmd). For other platforms, we use 'sh'.
      // We quote the script path to handle spaces in the path.
      const command =
        process.platform === 'win32'
          ? `"${actionDetails.scriptPath}"`
          : `sh "${actionDetails.scriptPath}"`;

      const { stdout, stderr } = await execPromise(command);
      if (stderr) {
        console.error(`Error executing script: ${stderr}`);
        return { success: false, message: stderr };
      }
      console.log(`Script output: ${stdout}`);
      return { success: true, message: stdout };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to execute script: ${message}`);
      return { success: false, message };
    }
  }

  static async executeAction(actionType: string, actionDetails: Record<string, any>): Promise<{ success: boolean; message: string }> {
    switch (actionType) {
      case 'script':
        return await this.executeScript(actionDetails as { scriptPath: string });
      case 'text':
        console.log('Text action not implemented yet.');
        return { success: false, message: 'Text action not implemented yet.' };
      case 'file':
        console.log('File action not implemented yet.');
        return { success: false, message: 'File action not implemented yet.' };
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

