import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './theme';

import BrowserScreen from './screens/BrowserScreen';
import HistoryScreen from './screens/HistoryScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import SettingsScreen from './screens/SettingsScreen';
import BeckyScreen from './screens/BeckyScreen';
import TabsScreen from './screens/TabsScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  dark: true,
  colors: {
    primary: colors.accent,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName="Browser"
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Browser" component={BrowserScreen} />
          <Stack.Screen name="Tabs" component={TabsScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Becky" component={BeckyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
