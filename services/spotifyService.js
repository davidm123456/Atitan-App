import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { encode as base64Encode } from 'base-64';

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1';

const spotifyConfig = {
  clientId: 'YOUR_SPOTIFY_CLIENT_ID',
  clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET',
  scopes: [
    'user-read-currently-playing',
    'user-modify-playback-state',
    'streaming',
    'user-read-email',
    'user-read-private'
  ],
  redirectUri: makeRedirectUri({
    scheme: 'your-app-scheme'
  }),
};

let accessToken = null;

export const getSpotifyAuthConfig = () => ({
  authEndpoint: SPOTIFY_AUTH_ENDPOINT,
  tokenEndpoint: SPOTIFY_TOKEN_ENDPOINT,
  clientId: spotifyConfig.clientId,
  scopes: spotifyConfig.scopes,
  redirectUri: spotifyConfig.redirectUri,
  responseType: ResponseType.Code,
});

export const setAccessToken = (token) => {
  accessToken = token;
};

export const searchTracks = async (query) => {
  if (!accessToken) throw new Error('Not authenticated');

  const response = await fetch(
    `${SPOTIFY_API_ENDPOINT}/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
};

export const playSong = async (trackUri) => {
  if (!accessToken) throw new Error('Not authenticated');

  await fetch(`${SPOTIFY_API_ENDPOINT}/me/player/play`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: [trackUri],
    }),
  });
}; 