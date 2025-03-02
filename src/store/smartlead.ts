import { create } from 'zustand';

type SmartleadStore = {
  smartleadSync: string;
  setSmartleadSync: (smartleadSync: string) => void;
  smartlead: string;
  setSmartlead: (smartleadSync: string) => void;
};

export const useSmartleadStore = create<SmartleadStore>((set) => ({
  smartleadSync: '',
  setSmartleadSync: (smartleadSync) => set({ smartleadSync }),
  smartlead: '',
  setSmartlead: (smartlead) => set({ smartlead }),
}));
