import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { UserSettingsPlan } from '@prisma/client';

interface IUserSettings {
  plan: UserSettingsPlan | null;
  setUserPlan: (plan: UserSettingsPlan) => void; // Updated to accept a parameter
  setHydrated(): void;
  hydrated: boolean;
}

export const useUsersPlanStore = create<IUserSettings>()(
  devtools(
    persist(
      immer((set) => ({
        hydrated: false,
        plan: null,
        setUserPlan: (plan: UserSettingsPlan) =>
          set((state) => {
            state.plan = plan;
          }),
        setHydrated() {
          set({ hydrated: true });
        },
      })),
      {
        name: 'usersPlanStore',
        onRehydrateStorage() {
          return (state, error) => {
            if (!error) state?.setHydrated();
          };
        },
      }
    ),
    { enabled: process.env.NODE_ENV === 'development' }
  )
);
