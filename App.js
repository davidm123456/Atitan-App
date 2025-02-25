import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { getSpotifyAuthConfig, setAccessToken, searchTracks, playSong,useSpotifyAuth, getUserPlaylists, openSpotifyWebPlayer } from './services/spotifyService';
import { useAuthRequest } from 'expo-auth-session';
import { encode as base64Encode } from 'base-64';
import * as WebBrowser from 'expo-web-browser';
import { getSpotifyAuthUrl } from './services/spotifyService';
import { authenticateAppleMusic, playSong as playAppleMusicSong, searchSongs } from './services/appleMusicService';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

// Create new screens
const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music App Login</Text>
      <Button 
        title="Login" 
        onPress={() => navigation.navigate('MainTabs')}
      />
    </View>
  );
};

const SpotifyScreen = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [request, response, promptAsync] = useSpotifyAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setAccessToken(access_token);
      // Automatically redirect to Spotify web player after successful auth
      openSpotifyWebPlayer();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify</Text>
      
      {!accessToken ? (
        <Button
          title="Login with Spotify"
          onPress={() => promptAsync({ showInRecents: true })}
          disabled={!request}
        />
      ) : (
        <Button
          title="Open Spotify Web Player"
          onPress={openSpotifyWebPlayer}
        />
      )}
    </View>
  );
};

const AppleMusicScreen = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleMusicLogin = async () => {
    try {
      if (Platform.OS !== 'web') {
        setError('Apple Music web integration is only available in web browser');
        return;
      }

      const authorized = await authenticateAppleMusic();
      setIsAuthorized(authorized);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const songs = await searchSongs(searchQuery);
      setSearchResults(songs);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = async (songId) => {
    try {
      await playSong(songId);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apple Music Integration</Text>
      
      {Platform.OS !== 'web' ? (
        <Text style={styles.error}>Apple Music web integration is only available in web browser</Text>
      ) : (
        <>
          {error && <Text style={styles.error}>{error}</Text>}
          
          {!isAuthorized ? (
            <Button
              title="Connect to Apple Music"
              onPress={handleAppleMusicLogin}
            />
          ) : (
            <>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for a song..."
                  onSubmitEditing={handleSearch}
                />
                <Button title="Search" onPress={handleSearch} />
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id}
                  style={styles.songList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.songItem}
                      onPress={() => handlePlaySong(item.id)}
                    >
                      <Text style={styles.songName}>{item.attributes.name}</Text>
                      <Text style={styles.artistName}>
                        {item.attributes.artistName}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Spotify" component={SpotifyScreen} />
      <Tab.Screen name="Apple Music" component={AppleMusicScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  searchContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  trackList: {
    width: '90%',
  },
  trackItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trackName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  songList: {
    width: '90%',
  },
  songItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '80%',
    alignItems: 'stretch',
  },
  menuSpacing: {
    height: 20,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    width: '100%',
    marginVertical: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistTracks: {
    fontSize: 14,
    color: '#666',
  },
});
