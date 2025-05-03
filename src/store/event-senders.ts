import { create } from 'zustand';

type Filters = {
  sender: string;
  sender_label: string;
  email_server: string;
  email_reseller: string;
  platform: string;
  type: string;
  host_id: string;
};

type EventSendersStore = {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  isProcessing: boolean;
  setIsProcessing: (loading: boolean) => void;
};

export const useEventSendersStore = create<EventSendersStore>((set) => ({
  filters: {
    sender: '',
    sender_label: '',
    email_server: '',
    email_reseller: '',
    platform: '',
    type: '',
    host_id: '',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  isProcessing: false,
  setIsProcessing: (loading) => set(() => ({ isProcessing: loading })),
}));
