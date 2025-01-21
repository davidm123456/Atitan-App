import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text h3 style={styles.header}>Choose Your Music Service</Text>
      
      <TouchableOpacity 
        style={styles.serviceButton}
        onPress={() => navigation.navigate('SpotifyScreen')}
      >
        <Image 
          source={require('../assets/spotify-logo.png')}
          style={styles.serviceLogo}
        />
        <Text style={styles.serviceText}>Spotify</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.serviceButton}
        onPress={() => navigation.navigate('AppleMusicScreen')}
      >
        <Image 
          source={require('../assets/apple-music-logo.png')}
          style={styles.serviceLogo}
        />
        <Text style={styles.serviceText}>Apple Music</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
  },
  serviceButton: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  serviceLogo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 