import { Key } from './types.js';

// Key mapping for keyboard input handling
export const keyMap: { [key: string]: Key } = {
  'Control': Key.Ctrl, 'Shift': Key.Shift, 'Alt': Key.Alt, 'Meta': Key.Meta, // Modifiers
  'a': Key.A, 'b': Key.B, 'c': Key.C, 'd': Key.D, 'e': Key.E, 'f': Key.F, 'g': Key.G, 'h': Key.H, 'i': Key.I, 'j': Key.J, 'k': Key.K, 'l': Key.L, 'm': Key.M, 'n': Key.N, 'o': Key.O, 'p': Key.P, 'q': Key.Q, 'r': Key.R, 's': Key.S, 't': Key.T, 'u': Key.U, 'v': Key.V, 'w': Key.W, 'x': Key.X, 'y': Key.Y, 'z': Key.Z,
  'A': Key.A, 'B': Key.B, 'C': Key.C, 'D': Key.D, 'E': Key.E, 'F': Key.F, 'G': Key.G, 'H': Key.H, 'I': Key.I, 'J': Key.J, 'K': Key.K, 'L': Key.L, 'M': Key.M, 'N': Key.N, 'O': Key.O, 'P': Key.P, 'Q': Key.Q, 'R': Key.R, 'S': Key.S, 'T': Key.T, 'U': Key.U, 'V': Key.V, 'W': Key.W, 'X': Key.X, 'Y': Key.Y, 'Z': Key.Z,
  '0': Key.Zero, '1': Key.One, '2': Key.Two, '3': Key.Three, '4': Key.Four, '5': Key.Five, '6': Key.Six, '7': Key.Seven, '8': Key.Eight, '9': Key.Nine,
  'Enter': Key.Enter, 'Escape': Key.Escape, ' ': Key.Space, 'Tab': Key.Tab,
  'ArrowUp': Key.ArrowUp, 'ArrowDown': Key.ArrowDown, 'ArrowLeft': Key.ArrowLeft, 'ArrowRight': Key.ArrowRight,
};

// File organization extensions mapping
export const FILE_ORGANIZATION_EXTENSIONS: Record<string, string> = {
  '.pdf': 'Documents',
  '.doc': 'Documents',
  '.docx': 'Documents',
  '.txt': 'Documents',
  '.jpg': 'Images',
  '.jpeg': 'Images',
  '.png': 'Images',
  '.gif': 'Images',
  '.bmp': 'Images',
  '.mp4': 'Videos',
  '.avi': 'Videos',
  '.mov': 'Videos',
  '.mp3': 'Music',
  '.wav': 'Music',
  '.flac': 'Music',
  '.zip': 'Archives',
  '.rar': 'Archives',
  '.7z': 'Archives',
}; 