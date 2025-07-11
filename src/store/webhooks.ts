import { create } from 'zustand';

interface WebhookSettingsState {
  isUpdating: boolean;
  setIsUpdating: (val: boolean) => void;
}

export const useWebhookSettingsStore = create<WebhookSettingsState>((set) => ({
  isUpdating: false,
  setIsUpdating: (val) => set({ isUpdating: val }),
}));
