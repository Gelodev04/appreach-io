import { create } from 'zustand';

type Filters = {
  profile: string;
  recipient: string;
  sender: string;
  platform: string;
  status: string;
  sentiment: string;
  message: string;
};

type ManualEventsStore = {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
};

export const useManualEventsStore = create<ManualEventsStore>((set) => ({
  filters: {
    profile: '',
    recipient: '',
    sender: '',
    platform: '',
    status: '',
    sentiment: '',
    message: '',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}));
