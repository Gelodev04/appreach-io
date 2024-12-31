import { create } from 'zustand';

type TourDialogStore = {
  openModal: boolean;
  start: boolean;
  stepIndex: number;
  setStep: (stepIndex: number) => void;
  onClose: () => void;
  setOpenModal: (val: boolean) => void;
  setStart: (val: boolean) => void;
};

export const useTourDialogStore = create<TourDialogStore>((set) => ({
  openModal: false,
  start: false,
  stepIndex: 1,
  setStep: (stepIndex) => set({ start: true, stepIndex }),
  onClose: () => set({ start: false }),
  setOpenModal: (val) => set({ openModal: val }),
  setStart: (val) => set({ start: val }),
}));
