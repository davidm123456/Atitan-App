import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import { AppleMusicService } from '../services/AppleMusicService';
import { SpotifyService } from '../services/SpotifyService';
import { EXPO_PUBLIC_APPLE_DEVELOPER_TOKEN } from '@env';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export const MusicServiceScreen = ({ route, navigation }: any) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { service } = route.params;
  
  const spotifyService = SpotifyService.getInstance();
  const appleMusicService = AppleMusicService.getInstance();

  const [request, response, promptAsync] = useAuthRequest(
    spotifyService.getAuthConfig(),
    discovery
  );

  useEffect(() => {
    if (service === 'apple') {
      initializeAppleMusic();
    }
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && service === 'spotify') {
      const { access_token } = response.params;
      spotifyService.setAccessToken(access_token);
      fetchSpotifyPlaylists();
    }
  }, [response]);

  const initializeAppleMusic = async () => {
    try {
      await appleMusicService.initialize(EXPO_PUBLIC_APPLE_DEVELOPER_TOKEN || '');
      await appleMusicService.authorize();
      const applePlaylists = await appleMusicService.getPlaylists();
      setPlaylists(applePlaylists);
    } catch (error) {
      console.error('Apple Music initialization error:', error);
    }
  };

  const fetchSpotifyPlaylists = async () => {
    try {
      const spotifyPlaylists = await spotifyService.getPlaylists();
      setPlaylists(spotifyPlaylists);
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
    }
  };

  const handlePlaySong = async (item: any) => {
    try {
      if (service === 'spotify') {
        await spotifyService.playSong(item.uri);
      } else {
        await appleMusicService.playSong(item.id);
      }
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {service === 'spotify' ? 'Spotify' : 'Apple Music'} Integration
      </Text>
      {playlists.length === 0 && (
        <Button
          title={`Connect to ${service === 'spotify' ? 'Spotify' : 'Apple Music'}`}
          onPress={() => service === 'spotify' ? promptAsync() : initializeAppleMusic()}
        />
      )}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.playlistItem}
            onPress={() => handlePlaySong(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playlistItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
}); 