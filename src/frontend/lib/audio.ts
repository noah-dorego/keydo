// Audio utility for playing shortcut notification sounds
export class AudioPlayer {
  private static audio: HTMLAudioElement | null = null;

  static async playShortcutSound(): Promise<void> {
    try {
      const settings = await window.electron.getSettings();
      if (!settings.notificationSoundsEnabled) {
        return; // Do not play sound if disabled
      }

      // Create audio element if it doesn't exist
      if (!this.audio) {
        this.audio = new Audio();
        this.audio.src = '/src/frontend/assets/notification_tone_1.mp3';
        this.audio.volume = 0.5;

        // Clean up after playing
        this.audio.addEventListener('ended', () => {
          this.audio = null;
        });
      }

      // Play the sound
      await this.audio.play().catch((error) => {
        console.warn('Failed to play shortcut sound:', error);
        this.audio = null; // Reset on error
      });
    } catch (error) {
      console.warn('Failed to fetch settings or play sound:', error);
    }
  }

  static stopSound(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
} 