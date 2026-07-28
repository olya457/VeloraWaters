import AsyncStorage from '@react-native-async-storage/async-storage';
import {Artwork, Session, Spot, TripPlan} from '../types';
export const APP_STORAGE_KEY = '@velora_waters/app_state_v2';

export type PersistedAppState = {
  onboarded: boolean;
  spots: Spot[];
  sessions: Session[];
  artworks: Artwork[];
  tripPlans: TripPlan[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parsePersistedState(value: string): Partial<PersistedAppState> {
  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed)) {
    throw new Error('Saved app state must be an object');
  }

  const result: Partial<PersistedAppState> = {};
  if (typeof parsed.onboarded === 'boolean') {
    result.onboarded = parsed.onboarded;
  }
  if (Array.isArray(parsed.spots)) {
    result.spots = parsed.spots as Spot[];
  }
  if (Array.isArray(parsed.sessions)) {
    result.sessions = parsed.sessions as Session[];
  }
  if (Array.isArray(parsed.artworks)) {
    result.artworks = parsed.artworks as Artwork[];
  }
  if (Array.isArray(parsed.tripPlans)) {
    result.tripPlans = parsed.tripPlans as TripPlan[];
  }
  return result;
}

export async function loadAppState(): Promise<Partial<PersistedAppState> | null> {
  const value = await AsyncStorage.getItem(APP_STORAGE_KEY);
  if (!value) {
    return null;
  }
  return parsePersistedState(value);
}

export async function saveAppState(state: PersistedAppState): Promise<void> {
  await AsyncStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
}
