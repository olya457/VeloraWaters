import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../constants/theme';
import {DrawScreen} from '../screens/draw/DrawScreen';
import {GameScreen} from '../screens/game/GameScreen';
import {LocationsScreen} from '../screens/locations/LocationsScreen';
import {MapScreen} from '../screens/locations/MapScreen';
import {SessionsScreen} from '../screens/sessions/SessionsScreen';
import {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const createTabIcon =
  (symbol: string) =>
  ({color}: {color: string}) =>
    <Text style={[styles.icon, {color}]}>{symbol}</Text>;

const discoverIcon = createTabIcon('🌊');
const atlasIcon = createTabIcon('🗺️');
const journalIcon = createTabIcon('📖');
const plannerIcon = createTabIcon('🧭');
const studioIcon = createTabIcon('🎨');

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: styles.bar,
      }}>
      <Tab.Screen
        name="Discover"
        component={LocationsScreen}
        options={{tabBarIcon: discoverIcon}}
      />
      <Tab.Screen
        name="Atlas"
        component={MapScreen}
        options={{tabBarIcon: atlasIcon}}
      />
      <Tab.Screen
        name="Journal"
        component={SessionsScreen}
        options={{tabBarIcon: journalIcon}}
      />
      <Tab.Screen
        name="Planner"
        component={GameScreen}
        options={{tabBarIcon: plannerIcon}}
      />
      <Tab.Screen
        name="Studio"
        component={DrawScreen}
        options={{tabBarIcon: studioIcon}}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 86,
    paddingTop: 10,
    paddingBottom: 22,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  icon: {fontSize: 27, lineHeight: 34},
});
