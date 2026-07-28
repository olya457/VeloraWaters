import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../constants/theme';
import {GalleryScreen} from '../screens/draw/GalleryScreen';
import {GamePlayScreen} from '../screens/game/GamePlayScreen';
import {GameSetupScreen} from '../screens/game/GameSetupScreen';
import {AddSpotScreen} from '../screens/locations/AddSpotScreen';
import {SpotDetailsScreen} from '../screens/locations/SpotDetailsScreen';
import {OnboardingScreen} from '../screens/onboarding/OnboardingScreen';
import {LiveSessionScreen} from '../screens/sessions/LiveSessionScreen';
import {NewSessionScreen} from '../screens/sessions/NewSessionScreen';
import {SettingsScreen} from '../screens/settings/SettingsScreen';
import {useApp} from '../store/AppContext';
import {AppTabs} from './AppTabs';
import {RootStackParamList} from './types';
import {navigationRef} from './rootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {hydrated, onboarded} = useApp();
  if (!hydrated) {
    return null;
  }
  if (!onboarded) {
    return <OnboardingScreen />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.background},
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Main" component={AppTabs} />
        <Stack.Screen name="WaterDetails" component={SpotDetailsScreen} />
        <Stack.Screen name="WaterEditor" component={AddSpotScreen} />
        <Stack.Screen name="SessionBuilder" component={NewSessionScreen} />
        <Stack.Screen name="ActiveSession" component={LiveSessionScreen} />
        <Stack.Screen name="PlanBuilder" component={GameSetupScreen} />
        <Stack.Screen name="PlanDetails" component={GamePlayScreen} />
        <Stack.Screen name="ArtLibrary" component={GalleryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
