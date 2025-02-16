import { create } from 'zustand';

type SmartleadSyncStore = {
  smartlead: string;
  setSmartlead: (smartlead: string) => void;
};

export const useSmartleadSyncStore = create<SmartleadSyncStore>((set) => ({
  smartlead: '',
  setSmartlead: (smartlead) => set({ smartlead }),
}));
