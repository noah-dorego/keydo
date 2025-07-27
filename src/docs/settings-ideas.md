# Potential Settings Ideas

Here is a list of potential settings that could be added to Keydo to enhance its functionality and user experience.

---

### General & Core Functionality

These settings would give users more control over the application's core behavior.

1.  **Launch on System Startup**
    -   **Description:** A toggle to allow Keydo to start automatically when the user logs into their computer.
    -   **Benefit:** This is a crucial feature for a background utility, saving users from having to manually start the application after every reboot.
    -   **Implementation:** Can be implemented using Electron's `app.setLoginItemSettings()` API.

2.  **Backup and Restore Shortcuts**
    -   **Description:** "Export" and "Import" buttons to save all shortcuts and settings to a JSON file, and to load them back.
    -   **Benefit:** Provides a vital safety net for users who have invested time in creating complex shortcuts, and allows for easy migration to new machines.

3.  **Customize "Open App" Shortcut**
    -   **Description:** An input field allowing the user to change the global hotkey for opening the main application window.
    -   **Benefit:** Gives users full control over the application's primary interaction and helps resolve potential hotkey conflicts with other software.

---

### Interface & User Experience

These settings would allow users to personalize the look and feel of the application.

1.  **Application Theme**
    -   **Description:** A setting to switch between "Light", "Dark", and "System" themes.
    -   **Benefit:** A standard feature in modern applications that significantly improves user comfort. This is well-supported by `shadcn/ui`.

2.  **Custom Notification Sound**
    -   **Description:** A button that opens a file dialog, allowing the user to select their own audio file for the notification sound.
    -   **Benefit:** A simple but powerful personalization feature that makes the app feel more integrated into a user's workflow.

---

### Execution & Safety

These settings would give users more confidence and control when executing their shortcuts.

1.  **"Pause All Shortcuts" Master Switch**
    -   **Description:** A single, prominent toggle that temporarily disables all global shortcuts at once.
    -   **Benefit:** Extremely useful when working in applications with conflicting key bindings (e.g., video games, IDEs), allowing users to quickly "mute" Keydo without un-registering every shortcut individually.

2.  **Confirm Dangerous Actions**
    -   **Description:** A toggle that, when enabled, shows a confirmation dialog before executing actions that could be destructive (e.g., running scripts, organizing desktop files).
    -   **Benefit:** Adds a critical layer of safety, preventing accidental execution of powerful shortcuts and giving users more confidence to build complex automations. 