import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { 
  getSpotifyAuthConfig, 
  setAccessToken, 
  searchTracks, 
  playSong 
} from './services/spotifyService';
import { useAuthRequest } from 'expo-auth-session';
import { encode as base64Encode } from 'base-64';

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
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set up authentication request
  const [request, response, promptAsync] = useAuthRequest(
    getSpotifyAuthConfig(),
    { useProxy: true }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      // Exchange code for token
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code) => {
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${base64Encode(
            `${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`
          )}`,
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${
          spotifyConfig.redirectUri
        }`,
      });

      const data = await tokenResponse.json();
      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const result = await searchTracks(search);
      setTracks(result.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (trackUri) => {
    try {
      await playSong(trackUri);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify Integration</Text>
      
      {!request && (
        <Button
          title="Connect to Spotify"
          onPress={() => promptAsync()}
        />
      )}

      {request && (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search for a song..."
              onSubmitEditing={handleSearch}
            />
            <Button title="Search" onPress={handleSearch} />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" />
          ) : (
            <FlatList
              data={tracks}
              keyExtractor={(item) => item.id}
              style={styles.trackList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.trackItem}
                  onPress={() => handlePlayTrack(item.uri)}
                >
                  <Text style={styles.trackName}>{item.name}</Text>
                  <Text style={styles.artistName}>
                    {item.artists.map(artist => artist.name).join(', ')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

const AppleMusicScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apple Music Integration</Text>
      {/* Apple Music integration will go here */}
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
});
