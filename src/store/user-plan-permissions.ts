import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface OtherToolsPermission {
  otherTools: boolean;
  setOtherTools: (permission: boolean) => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useUserPlanPermissionsStore = create<OtherToolsPermission>()(
  devtools(
    persist(
      immer((set) => ({
        otherTools: false,
        hydrated: false,
        setOtherTools: (permission: boolean) =>
          set((state) => {
            state.otherTools = permission;
          }),
        setHydrated: () => set({ hydrated: true }),
      })),
      {
        name: 'userPlanPermissionsStore',
        onRehydrateStorage: () => (state, error) => {
          if (!error) state?.setHydrated();
        },
      }
    )
  )
);
