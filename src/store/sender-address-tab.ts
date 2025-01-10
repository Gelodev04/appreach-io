import { create } from 'zustand';

type SenderAddressTabStore = {
  tab: string;
  setTab: (tab: string) => void;
};

export const useSenderAddressTabStore = create<SenderAddressTabStore>((set) => ({
  tab: 'sender_engagement',
  setTab: (tab) => set({ tab }),
}));
