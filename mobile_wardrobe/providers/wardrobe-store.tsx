import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'mobile-wardrobe-state-v1';

export type WardrobeItem = {
  id: string;
  image_url: string;
  category: string;
  tags: string[];
};

type WardrobeContextValue = {
  currentOutfit: string | null;
  setCurrentOutfit: (imageUri: string | null) => void;
  isHydrated: boolean;
  setBodyProfile: (imageUri: string) => void;
  userBodyProfile: string | null;
  userWardrobe: WardrobeItem[];
  addWardrobeItem: (item: Omit<WardrobeItem, 'id'>) => void;
};

const WardrobeContext = createContext<WardrobeContextValue | undefined>(undefined);

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
  const [userWardrobe, setUserWardrobe] = useState<WardrobeItem[]>([]);
  const [userBodyProfile, setUserBodyProfile] = useState<string | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);

        if (!savedState) {
          setIsHydrated(true);
          return;
        }

        const parsedState = JSON.parse(savedState) as {
          currentOutfit?: string | null;
          userBodyProfile?: string | null;
          userWardrobe?: WardrobeItem[];
        };

        setCurrentOutfit(parsedState.currentOutfit ?? null);
        setUserBodyProfile(parsedState.userBodyProfile ?? null);
        setUserWardrobe(parsedState.userWardrobe ?? []);
      } catch (error) {
        console.warn('Unable to restore wardrobe state', error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateState();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistState = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ currentOutfit, userBodyProfile, userWardrobe }),
        );
      } catch (error) {
        console.warn('Unable to persist wardrobe state', error);
      }
    };

    persistState();
  }, [currentOutfit, isHydrated, userBodyProfile, userWardrobe]);

  const addWardrobeItem = (item: Omit<WardrobeItem, 'id'>) => {
    setUserWardrobe((currentItems) => [
      {
        ...item,
        id: `wardrobe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
      ...currentItems,
    ]);
  };

  const setBodyProfile = (imageUri: string) => {
    setUserBodyProfile(imageUri);
    setCurrentOutfit(null);
  };

  const value = useMemo(
    () => ({
      addWardrobeItem,
      currentOutfit,
      isHydrated,
      setBodyProfile,
      setCurrentOutfit,
      userBodyProfile,
      userWardrobe,
    }),
    [currentOutfit, isHydrated, userBodyProfile, userWardrobe],
  );

  return <WardrobeContext.Provider value={value}>{children}</WardrobeContext.Provider>;
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);

  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider.');
  }

  return context;
};