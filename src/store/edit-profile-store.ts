import { create } from 'zustand';

type EditProfileStore = {
  value: Record<string, number>;
  setValue: (name: string, value: number) => void;
};

export const useEditProfileStore = create<EditProfileStore>((set) => ({
  value: {
    'Scroll through message': 25,
    'Mark as important': 25,
    'Remove from spam': 25,
    'Move to primary': 25,
    'Click links': 25,
    'Reply using AI': 25,
  },
  setValue: (name, val) =>
    set((state) => ({
      value: {
        ...state.value,
        [name]: val,
      },
    })),
}));
