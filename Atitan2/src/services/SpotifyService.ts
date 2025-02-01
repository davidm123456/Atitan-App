import { makeRedirectUri } from 'expo-auth-session';
import { EXPO_PUBLIC_SPOTIFY_CLIENT_ID } from '@env';

export class SpotifyService {
  private static instance: SpotifyService;
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  getAuthConfig() {
    return {
      clientId: EXPO_PUBLIC_SPOTIFY_CLIENT_ID || '',
      scopes: ['playlist-read-private', 'streaming', 'user-library-read'],
      redirectUri: makeRedirectUri({
        scheme: 'your-app-scheme'
      }),
    };
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async getPlaylists(): Promise<any[]> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
      throw error;
    }
  }

  async playSong(trackUri: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      });
    } catch (error) {
      console.error('Error playing song:', error);
      throw error;
    }
  }
} 