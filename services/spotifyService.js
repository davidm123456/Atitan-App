import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session';

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
  // Using Expo's redirect URI
  redirectUri: makeRedirectUri({
    scheme: 'myapp'
  }),
};

export const useSpotifyAuth = () => {
  return useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: spotifyConfig.clientId,
      scopes: spotifyConfig.scopes,
      redirectUri: spotifyConfig.redirectUri,
    },
    discovery
  );
};

export const playSong = async (accessToken, trackUri) => {
  await fetch(`https://api.spotify.com/v1/me/player/play`, {
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