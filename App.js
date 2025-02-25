import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { 
  getSpotifyAuthConfig, 
  setAccessToken, 
  searchTracks, 
  playSong,
  useSpotifyAuth
} from './services/spotifyService';
import { useAuthRequest } from 'expo-auth-session';
import { encode as base64Encode } from 'base-64';
import * as WebBrowser from 'expo-web-browser';
import { getSpotifyAuthUrl } from './services/spotifyService';
import { authenticateAppleMusic, playSong as playAppleMusicSong } from './services/appleMusicService';

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
    }
  }, [response]);

  const handlePlaySong = async () => {
    if (!accessToken) return;
    
    try {
      // Example track URI - Replace with your desired track
      const trackUri = 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6';
      await playSong(accessToken, trackUri);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify Integration</Text>
      
      {!accessToken ? (
        <Button
          title="Login with Spotify"
          onPress={() => promptAsync()}
          disabled={!request}
        />
      ) : (
        <Button
          title="Play Sample Song"
          onPress={handlePlaySong}
        />
      )}
    </View>
  );
};

const AppleMusicScreen = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);

  const handleAppleMusicLogin = async () => {
    try {
      if (Platform.OS !== 'ios') {
        setError('Apple Music is only available on iOS devices');
        return;
      }

      const authorized = await authenticateAppleMusic();
      setIsAuthorized(authorized);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePlaySong = async () => {
    try {
      // Example song ID - Replace with actual Apple Music song ID
      await playAppleMusicSong('example_song_id');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apple Music Integration</Text>
      
      {Platform.OS !== 'ios' ? (
        <Text style={styles.error}>Apple Music is only available on iOS devices</Text>
      ) : (
        <>
          {error && <Text style={styles.error}>{error}</Text>}
          
          {!isAuthorized ? (
            <Button
              title="Connect to Apple Music"
              onPress={handleAppleMusicLogin}
            />
          ) : (
            <Button
              title="Play Sample Song"
              onPress={handlePlaySong}
            />
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
});
