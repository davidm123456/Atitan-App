import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Input, Button, Text } from 'react-native-elements';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    // TODO: Implement authentication logic
    console.log('Sign in:', email, password);
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.header}>Welcome Back!</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={handleSignIn}
        containerStyle={styles.buttonContainer}
      />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 15,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default SignInScreen; 