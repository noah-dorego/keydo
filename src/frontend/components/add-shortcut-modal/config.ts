import {
  FileText,
  Terminal,
  Lightbulb,
  FolderOpen,
  Hash,
  Type,
  Clipboard,
  Wrench,
  Cog,
  File,
  Folder,
  Sparkles,
  SquareTerminal,
} from "lucide-react";

import { ShortcutActionType, TextManipulationType, FileStructureType } from "@/frontend/types.ts";

export const actionTypes: ShortcutActionType[] = [
  { id: "basic", name: "Basic Shortcuts", icon: Wrench },
  { id: "text", name: "Text Manipulation", icon: FileText },
  { id: "file", name: "File System", icon: FolderOpen },
  { id: "script", name: "Run Script", icon: Terminal },
  { id: "ai", name: "AI Action", icon: Lightbulb, comingSoon: true },
  { id: "custom", name: "Custom Shortcuts", icon: Cog, comingSoon: true },
];

export const textManipulationTypes: TextManipulationType[] = [
  { id: 'wordCount', name: 'Word Count', icon: Hash },
  { id: 'upperCase', name: 'Upper Case', icon: Type },
  { id: 'titleCase', name: 'Title Case', icon: Type },
  { id: 'pasteText', name: 'Paste Text', icon: Clipboard },
];

export const fileSystemTypes: FileStructureType[] = [
  { id: 'openFile', name: 'Open File', icon: File },
  { id: 'openDirectory', name: 'Open Directory', icon: Folder },
  { id: 'cleanDesktop', name: 'Clean Desktop', icon: Sparkles },
  { id: 'openTerminal', name: 'Open Terminal in Directory', icon: SquareTerminal },
];

// Step configuration - defines the flow for each action type
export const stepConfig: Record<string, string[] | Record<string, string[]>> = {
  // Action type -> step sequence
  basic: {
    // Basic subtypes -> step sequence
    openWebsite: ['actionType', 'actionConfig', 'websiteInput', 'shortcutConfig'],
    openApplications: ['actionType', 'actionConfig', 'applicationInput', 'shortcutConfig'],
    organizeDesktop: ['actionType', 'actionConfig', 'fileOrganizationPreview', 'shortcutConfig'],
  },
  file: {
    // File system subtypes -> step sequence
    openFile: ['actionType', 'actionConfig', 'pathInput', 'shortcutConfig'],
    openDirectory: ['actionType', 'actionConfig', 'pathInput', 'shortcutConfig'],
    cleanDesktop: ['actionType', 'shortcutConfig'],
    openTerminal: ['actionType', 'actionConfig', 'pathInput', 'shortcutConfig'],
  },
  script: ['actionType', 'actionConfig', 'shortcutConfig'],
  ai: ['actionType', 'shortcutConfig'],
  custom: ['actionType', 'shortcutConfig'],
  text: {
    // Text manipulation subtypes -> step sequence
    wordCount: ['actionType', 'actionConfig', 'shortcutConfig'],
    upperCase: ['actionType', 'actionConfig', 'shortcutConfig'],
    titleCase: ['actionType', 'actionConfig', 'shortcutConfig'],
    pasteText: ['actionType', 'actionConfig', 'textInput', 'shortcutConfig'],
  }
}; 