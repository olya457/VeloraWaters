import {NavigatorScreenParams} from '@react-navigation/native';

export type MainTabParamList = {
  Discover: undefined;
  Atlas: undefined;
  Journal: undefined;
  Planner: undefined;
  Studio: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  WaterDetails: {id: string};
  WaterEditor: {id?: string};
  SessionBuilder: undefined;
  ActiveSession: {
    name: string;
    location: string;
    weather: string;
    method: string;
    coordinates: [number, number];
  };
  PlanBuilder: undefined;
  PlanDetails: {planId: string};
  ArtLibrary: undefined;
  Settings: undefined;
};
