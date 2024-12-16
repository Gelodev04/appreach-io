import { create } from 'zustand';

type ChecklistStore = {
  status: {
    step1Finished: boolean;
    step2Finished: boolean;
    step3Finished: boolean;
    step4Finished: boolean;
    step5Finished: boolean;
  };
  setStepStatus: (step: keyof ChecklistStore['status'], value: boolean) => void;
};

export const useChecklistStore = create<ChecklistStore>((set) => ({
  status: {
    step1Finished: false,
    step2Finished: false,
    step3Finished: false,
    step4Finished: false,
    step5Finished: false,
  },
  setStepStatus: (step, value) =>
    set((state) => ({
      status: {
        ...state.status,
        [step]: value,
      },
    })),
}));
