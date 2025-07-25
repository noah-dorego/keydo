export enum Key {
  Backspace = "Backspace",
  Tab = "Tab",
  Enter = "Enter",
  Shift = "Shift",
  Ctrl = "Ctrl",
  Cmd = "Cmd",
  CmdOrCtrl = "CmdOrCtrl",
  Alt = "Alt",
  CapsLock = "CapsLock",
  Escape = "Escape",
  Esc = "Esc",
  Space = " ",
  PageUp = "PageUp",
  PageDown = "PageDown",
  End = "End",
  Home = "Home",
  ArrowLeft = "ArrowLeft",
  ArrowUp = "ArrowUp",
  ArrowRight = "ArrowRight",
  ArrowDown = "ArrowDown",
  Left = "Left",
  Up = "Up",
  Right = "Right",
  Down = "Down",
  Insert = "Insert",
  Delete = "Delete",
  Zero = "0",
  ClosedParen = ")",
  One = "1",
  ExclamationMark = "!",
  Two = "2",
  AtSign = "@",
  Three = "3",
  PoundSign = "£",
  Hash = "#",
  Four = "4",
  DollarSign = "$",
  Five = "5",
  PercentSign = "%",
  Six = "6",
  Caret = "^",
  Seven = "7",
  Ampersand = "&",
  Eight = "8",
  Asterisk = "*",
  Nine = "9",
  OpenParen = "(",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",
  Meta = "Meta",
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",
  NumLock = "NumLock",
  ScrollLock = "ScrollLock",
  SemiColon = ";",
  Equals = "=",
  Comma = ",",
  Dash = "-",
  Period = ".",
  UnderScore = "_",
  PlusSign = "+",
  ForwardSlash = "/",
  Tilde = "~",
  GraveAccent = "`",
  OpenBracket = "[",
  ClosedBracket = "]",
  Quote = "'",
}

export enum ActionType {
  Script = "script",
  Text = "text",
  File = "file",
  Ai = "ai",
}

export type ActionParams = string | number | boolean | object;

export type ShortcutProps = {
  id: string;
  name: string;
  accelerator: string;
  actionType: string;
  actionDetails: Record<string, ActionParams> | undefined;
};

export interface ShortcutActionType {
  id: string;
  name: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

export interface TextManipulationType {
  id: string;
  name: string;
  icon: React.ElementType;
}

export interface FileStructureType {
  id: string;
  name:string;
  icon: React.ElementType;
}

export interface AddShortcutModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onShortcutAdded: () => void;
}

export interface LocalShortcutKey {
  modifier?: (Key | null)[];
  key: Key | null;
}

export interface StepData {
  actionType: string;
  textManipulationType: string;
  builtinType: string;
  fileSystemType: string;
  scriptPath: string;
  websiteUrl: string;
  shortcutName: string;
  definedShortcut: LocalShortcutKey | null;
  pasteText: string;
  applicationPath: string;
  filePath: string;
}

export type Settings = {
  notificationBannersEnabled: boolean;
  notificationSoundsEnabled: boolean;
  launchOnStartup: boolean;
};
