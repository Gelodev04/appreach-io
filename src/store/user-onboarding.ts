import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface OnboardingStatus {
  completedOn: string | null;
  setCompletedOn: (date: string | null) => void;
  hydrated: boolean;
  setHydrated: () => void;
  reset: () => void;
}

export const useUserOnboardingStore = create<OnboardingStatus>()(
  devtools(
    persist(
      immer((set) => ({
        completedOn: null,
        hydrated: false,
        setCompletedOn: (date: string | null) =>
          set((state) => {
            state.completedOn = date;
          }),
        setHydrated: () => set({ hydrated: true }),
        reset: () =>
          set((state) => {
            state.completedOn = null;
            state.hydrated = false;
          }),
      })),
      {
        name: 'userOnboardingStore',
        onRehydrateStorage: () => (state, error) => {
          if (!error) state?.setHydrated();
        },
      }
    )
  )
);
