# Keydo

A powerful desktop application for creating and managing custom keyboard shortcuts that automate your workflow across your entire system.

## Description

Keydo is an Electron-based desktop application that allows users to create custom global keyboard shortcuts to automate various tasks. Built with React, TypeScript, and Electron, it provides a modern, intuitive interface for managing shortcuts that can perform actions like text manipulation, file operations, application launching, and more.

### Key Features

- **Global Shortcut Management**: Create and manage keyboard shortcuts that work system-wide
- **Multiple Action Types**: Support for text manipulation, file operations, application launching, and AI integration
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Secure Execution**: Pre-defined action types ensure safe shortcut execution
- **Real-time Feedback**: Audio and visual notifications for shortcut execution
- **Persistent Storage**: Shortcuts are saved and restored between sessions

### Supported Action Types

- **Text Actions**: Insert text snippets, transform text (uppercase, lowercase, etc.), clipboard operations
- **File Actions**: Open files/folders, create files from templates, organize files by type
- **Application Actions**: Launch applications, open websites
- **AI Actions**: Quick AI prompts and integrations (planned feature)

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/keydo.git
   cd keydo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

This will start both the React development server and the Electron application in development mode.

### Building for Production

#### Build for all platforms
```bash
# Build for macOS (ARM64)
npm run dist:mac

# Build for Windows (x64)
npm run dist:win

# Build for Linux (x64)
npm run dist:linux
```

#### Build for specific platform
```bash
# Build the React app
npm run build

# Transpile Electron code
npm run transpile:electron
```

## Usage

### Getting Started

1. **Launch the Application**: Start Keydo and it will run in the background
2. **Create Your First Shortcut**: Click the "+" button to add a new shortcut
3. **Configure the Shortcut**:
   - Choose a name for your shortcut
   - Select the key combination (e.g., Ctrl+Shift+K)
   - Choose an action type (Text, File, Application, etc.)
   - Configure the action details
4. **Test Your Shortcut**: Use the configured key combination to trigger your shortcut

### Default Shortcut

The application uses `Alt+CmdOrCtrl+X` as the default shortcut to show/hide the main window.

### Shortcut Configuration

Each shortcut consists of:
- **Name**: A descriptive name for the shortcut
- **Accelerator**: The key combination (e.g., "Ctrl+Shift+K")
- **Action Type**: The type of action to perform
- **Action Details**: Specific parameters for the chosen action

### Action Types

#### Text Actions
- Insert predefined text snippets
- Transform selected text (uppercase, lowercase, etc.)
- Copy text to clipboard
- Auto-type frequently used phrases

#### File Actions
- Open specific files or folders
- Create files from templates
- Organize files by type (images, documents, etc.)
- Bulk file operations

#### Application Actions
- Launch applications
- Open websites in default browser
- Switch between applications

## Development

### Project Structure

```
keydo/
├── src/
│   ├── electron/          # Electron main process
│   │   ├── main.ts        # Main process entry point
│   │   ├── shortcut-manager.ts  # Shortcut management logic
│   │   ├── actions.ts     # Action execution handlers
│   │   └── types.ts       # TypeScript type definitions
│   └── frontend/          # React frontend
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── lib/           # Utility functions
│       └── types.ts       # Frontend type definitions
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the React application
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the built application
- `npm run dist:mac` - Build for macOS
- `npm run dist:win` - Build for Windows
- `npm run dist:linux` - Build for Linux

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Electron 33
- **Build Tools**: Vite, TypeScript
- **UI Components**: Radix UI, Lucide React
- **State Management**: React hooks and context
- **Storage**: electron-store for persistent data

## Contributing

We welcome contributions to Keydo! Here's how you can help:

### Development Guidelines

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** and TypeScript conventions
3. **Write meaningful commit messages** and include tests when possible
4. **Update documentation** for any new features or changes
5. **Submit a pull request** with a clear description of your changes

### Code Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write descriptive variable and function names
- Include JSDoc comments for complex functions
- Test your changes thoroughly

### Areas for Contribution

- **New Action Types**: Implement additional shortcut actions
- **UI Improvements**: Enhance the user interface and experience
- **Cross-Platform Compatibility**: Ensure features work across all platforms
- **Documentation**: Improve guides and examples
- **Testing**: Add unit and integration tests
- **Performance**: Optimize application performance

### Reporting Issues

When reporting bugs or requesting features, please include:
- Operating system and version
- Keydo version
- Steps to reproduce the issue
- Expected vs actual behavior
- Any error messages or logs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/keydo/issues)
- **Discussions**: [Join the discussion](https://github.com/yourusername/keydo/discussions)
- **Email**: your.email@example.com

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/) for cross-platform desktop development
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Keydo** - Automate your workflow with custom keyboard shortcuts.
