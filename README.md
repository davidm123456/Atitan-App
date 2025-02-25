# Atitan Music App

A React Native mobile application that allows users to play music through Spotify or Apple Music APIs.

## Features

- User Authentication
  - Sign up with email/password
  - Sign in with existing account
  - Password reset functionality

- Music Integration
  - Connect with Spotify API
  - Connect with Apple Music API
  - Basic playback controls
  - Song search and selection

## Technical Stack

- React Native with Expo
- Firebase Authentication
- Spotify Web API
- Apple Music MusicKit JS

## Setup Instructions

1. Install dependencies:
```bash
npm install -g expo-cli
npx create-expo-app atitan-app
cd atitan-app
```

2. Install required packages:
```bash
npm install @react-navigation/native @react-navigation/stack
npm install firebase
npm install expo-auth-session
npm install @react-native-async-storage/async-storage
```

3. Set up environment variables in a `.env` file (do not commit this file):
```bash
FIREBASE_API_KEY=your_firebase_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
APPLE_MUSIC_KEY=your_apple_music_key
```

## Project Structure

```
atitan-app/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── SignupScreen.js
│   │   ├── Home/
│   │   │   └── HomeScreen.js
│   │   └── Music/
│   │       ├── SpotifyScreen.js
│   │       └── AppleMusicScreen.js
│   ├── components/
│   ├── navigation/
│   ├── services/
│   └── config/
├── App.js
└── package.json
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your Firebase project and add credentials
4. Register your app with Spotify Developer Dashboard
5. Set up Apple Music Developer account
6. Run the app with `npx expo start`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
