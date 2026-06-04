import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase } from './src/db/database';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setDbReady(true)).catch(console.error);
  }, []);

  if (!dbReady) {
    return <View style={{ flex: 1, backgroundColor: '#0D0B08' }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
