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

type LeadStatusStore = {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
};

export const useLeadStatusStore = create<LeadStatusStore>((set) => ({
  filters: {
    profile: '',
    recipient: '',
    sender: '',
    platform: '',
    status: '',
    sentiment: 'positive',
    message: '',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}));
