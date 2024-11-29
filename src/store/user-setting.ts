import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserSettingsPlan } from '@prisma/client';

interface IUserSettings extends UserSettingsPlan {
  setUserPlan: (plan: UserSettingsPlan) => void; // Updated to accept a parameter
}

export const useUsersPlanStore = create<IUserSettings>()(
  devtools(
    persist(
      (set) => ({
        amount: 0,
        amount_decimal: '2',
        checkout_session_id: '2',
        current_period_end: new Date(),
        lookup_key: '1',
        price_id: '2',
        start_date: new Date(),
        status: 'test',
        subscription_id: 'test',
        setUserPlan: (plan) => set(() => ({ ...plan })),
      }),
      { name: 'usersPlanStore' }
    )
  )
);
