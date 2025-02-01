import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = ({ navigation }: any) => {
  const { logout } = useAuth();

  const handleSpotifyLogin = () => {
    navigation.navigate('MusicService', { service: 'spotify' });
  };

  const handleAppleMusicLogin = () => {
    navigation.navigate('MusicService', { service: 'apple' });
  };

  return (
    <View style={styles.container}>
      <Button title="Connect to Spotify" onPress={handleSpotifyLogin} />
      <Button title="Connect to Apple Music" onPress={handleAppleMusicLogin} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
}); 