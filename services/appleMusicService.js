import { Platform } from 'react-native';

// We'll use this later when you get your developer token
const DEVELOPER_TOKEN = 'YOUR_DEVELOPER_TOKEN';

// Load MusicKit JS SDK
const loadMusicKit = async () => {
  if (!window.MusicKit) {
    const script = document.createElement('script');
    script.src = 'https://js-cdn.music.apple.com/musickit/v1/musickit.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = resolve;
    });
  }
  return Promise.resolve();
};

export const initializeAppleMusic = async () => {
  if (Platform.OS === 'web') {
    try {
      await loadMusicKit();
      await window.MusicKit.configure({
        developerToken: DEVELOPER_TOKEN,
        app: {
          name: 'Your App Name',
          build: '1.0.0'
        }
      });
      return true;
    } catch (error) {
      console.error('Error initializing Apple Music:', error);
      return false;
    }
  }
  return false;
};

export const authenticateAppleMusic = async () => {
  if (Platform.OS !== 'web') {
    throw new Error('Apple Music web integration is only available in web browser');
  }

  try {
    const music = window.MusicKit.getInstance();
    const authorized = await music.authorize();
    return authorized;
  } catch (error) {
    console.error('Error authenticating with Apple Music:', error);
    throw error;
  }
};

export const searchSongs = async (query) => {
  try {
    const music = window.MusicKit.getInstance();
    const results = await music.api.search(query, {
      types: ['songs'],
      limit: 20
    });
    return results.songs.data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
};

export const playSong = async (songId) => {
  try {
    const music = window.MusicKit.getInstance();
    await music.setQueue({
      songs: [songId]
    });
    await music.play();
  } catch (error) {
    console.error('Error playing song:', error);
    throw error;
  }
}; 