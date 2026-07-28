import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {spots as initialSpots} from '../data/content';
import {closeScreen, openScreen} from '../navigation/rootNavigation';
import {
  loadAppState,
  PersistedAppState,
  saveAppState,
} from '../storage/appStorage';
import {Artwork, Session, Spot, TripPlan} from '../types';

type AppState = {
  hydrated: boolean;
  onboarded: boolean;
  setOnboarded(value: boolean): void;
  navigate(name: string, params?: object): void;
  back(): void;
  spots: Spot[];
  toggleSaved(id: string): void;
  addSpot(spot: Spot): void;
  updateSpot(spot: Spot): void;
  sessions: Session[];
  addSession(session: Session): void;
  artworks: Artwork[];
  addArtwork(artwork: Artwork): void;
  deleteArtwork(id: string): void;
  tripPlans: TripPlan[];
  addTripPlan(plan: TripPlan): void;
  toggleTripItem(planId: string, itemId: string): void;
  deleteTripPlan(id: string): void;
};

const Context = createContext<AppState | null>(null);

export function AppProvider({children}: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [spots, setSpots] = useState(initialSpots);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    let active = true;
    loadAppState()
      .then(saved => {
        if (!active || !saved) {
          return;
        }
        if (saved.onboarded !== undefined) {
          setOnboarded(saved.onboarded);
        }
        if (saved.spots) {
          setSpots(saved.spots);
        }
        if (saved.sessions) {
          setSessions(saved.sessions);
        }
        if (saved.artworks) {
          setArtworks(saved.artworks);
        }
        if (saved.tripPlans) {
          setTripPlans(saved.tripPlans);
        }
      })
      .catch(error => {
        console.warn('Unable to restore saved app state', error);
      })
      .finally(() => {
        if (active) {
          setHydrated(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const state: PersistedAppState = {
        onboarded,
        spots,
        sessions,
        artworks,
        tripPlans,
      };
      saveAppState(state).catch(error => {
        console.warn('Unable to save app state', error);
      });
    }, 180);
    return () => clearTimeout(saveTimer.current);
  }, [hydrated, onboarded, spots, sessions, artworks, tripPlans]);

  const navigate = useCallback(openScreen, []);

  const value = useMemo<AppState>(
    () => ({
      hydrated,
      onboarded,
      setOnboarded,
      navigate,
      back: closeScreen,
      spots,
      toggleSaved: id =>
        setSpots(current =>
          current.map(item =>
            item.id === id ? {...item, saved: !item.saved} : item,
          ),
        ),
      addSpot: spot => setSpots(current => [spot, ...current]),
      updateSpot: spot =>
        setSpots(current =>
          current.map(item => (item.id === spot.id ? spot : item)),
        ),
      sessions,
      addSession: session => setSessions(current => [session, ...current]),
      artworks,
      addArtwork: artwork => setArtworks(current => [artwork, ...current]),
      deleteArtwork: id =>
        setArtworks(current => current.filter(item => item.id !== id)),
      tripPlans,
      addTripPlan: plan => setTripPlans(current => [plan, ...current]),
      toggleTripItem: (planId, itemId) =>
        setTripPlans(current =>
          current.map(plan =>
            plan.id !== planId
              ? plan
              : {
                  ...plan,
                  checklist: plan.checklist.map(item =>
                    item.id === itemId ? {...item, done: !item.done} : item,
                  ),
                },
          ),
        ),
      deleteTripPlan: id =>
        setTripPlans(current => current.filter(plan => plan.id !== id)),
    }),
    [
      hydrated,
      onboarded,
      navigate,
      spots,
      sessions,
      artworks,
      tripPlans,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const value = useContext(Context);
  if (!value) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return value;
}
