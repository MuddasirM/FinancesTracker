module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|react-native-vector-icons|react-native-worklets|@react-navigation|@react-native-async-storage)/)',
  ],
};
