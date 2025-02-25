import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const spotifyConfig = {
  clientId: '0ec881b57e374817a1d280ede7a22522',
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state'
  ],
};

export const useSpotifyAuth = () => {
  const redirectUri = makeRedirectUri({
    preferLocalhost: true,
    scheme: 'myapp'
  });

  console.log('Spotify Redirect URI:', redirectUri);

  return useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: spotifyConfig.clientId,
      scopes: spotifyConfig.scopes,
      redirectUri,
      usePKCE: false,
    },
    discovery
  );
};

export const openSpotifyWebPlayer = async () => {
  try {
    // For web platforms
    if (typeof window !== 'undefined') {
      window.location.replace('https://open.spotify.com/');
      return;
    }
    
    // For mobile platforms
    await WebBrowser.openAuthSessionAsync(
      'https://accounts.spotify.com/authorize',
      'https://open.spotify.com/'
    );
  } catch (error) {
    console.error('Error opening Spotify:', error);
    // Fallback
    if (typeof window !== 'undefined') {
      window.location.href = 'https://open.spotify.com/';
    }
  }
}; 