import { create } from 'zustand';

type EditProfileStore = {
  value: Record<string, number>;
  setValue: (name: string, value: number) => void;
};

export const useEditProfileStore = create<EditProfileStore>((set) => ({
  value: {
    'Scroll through message': 250,
    'Mark as important': 250,
    'Remove from spam': 250,
    'Move to primary': 250,
    'Click links': 250,
    'Reply using AI': 250,
  },
  setValue: (name, val) =>
    set((state) => ({
      value: {
        ...state.value,
        [name]: val,
      },
    })),
}));
