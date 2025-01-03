import { create } from 'zustand';

type EditProfileStore = {
  value: Record<string, number>;
  setValue: (name: string, value: number) => void;
};

export const useEditProfileStore = create<EditProfileStore>((set) => ({
  value: {
    scrollMessage: 25,
    markImportant: 25,
    removeSpam: 25,
    movePrimary: 25,
    clickLink: 25,
    replyMessage: 25,
  },
  setValue: (name, val) =>
    set((state) => ({
      value: {
        ...state.value,
        [name]: val,
      },
    })),
}));
