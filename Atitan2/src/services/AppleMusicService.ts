import * as MusicKit from 'expo-music-kit';

export class AppleMusicService {
  private static instance: AppleMusicService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AppleMusicService {
    if (!AppleMusicService.instance) {
      AppleMusicService.instance = new AppleMusicService();
    }
    return AppleMusicService.instance;
  }

  async initialize(developerToken: string): Promise<void> {
    if (!this.isInitialized) {
      try {
        await MusicKit.initialize({
          developerToken,
          app: {
            name: 'MusicApp',
            build: '1.0.0',
          },
        });
        this.isInitialized = true;
      } catch (error) {
        console.error('Error initializing Apple Music:', error);
        throw error;
      }
    }
  }

  async authorize(): Promise<void> {
    try {
      await MusicKit.authorize();
    } catch (error) {
      console.error('Error authorizing Apple Music:', error);
      throw error;
    }
  }

  async getPlaylists(): Promise<any[]> {
    try {
      const response = await MusicKit.getLibraryPlaylists();
      return response.data;
    } catch (error) {
      console.error('Error fetching Apple Music playlists:', error);
      throw error;
    }
  }

  async playSong(songId: string): Promise<void> {
    try {
      await MusicKit.play({
        songId,
      });
    } catch (error) {
      console.error('Error playing song:', error);
      throw error;
    }
  }
} 