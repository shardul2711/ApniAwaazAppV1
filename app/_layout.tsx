import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#e7fefc' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="signup" options={{ presentation: 'card' }} />
          <Stack.Screen name="setup" options={{ presentation: 'card' }} />
          <Stack.Screen name="rides" options={{ presentation: 'card' }} />
          <Stack.Screen name="groceries" options={{ presentation: 'card' }} />
          <Stack.Screen name="activity" options={{ presentation: 'card' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
