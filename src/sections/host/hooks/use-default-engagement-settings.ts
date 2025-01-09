import { hosts } from '@prisma/client';
import { defaultEngagementSettings } from 'src/constants';

export const useDefaultEngagementSettings = (currentItem: hosts | undefined) => {
  let updatedItem: hosts | undefined = currentItem;

  if (!currentItem?.engagementSettings && currentItem?.id) {
    updatedItem = {
      ...currentItem,
      engagementSettings: defaultEngagementSettings.engagementSettings,
    };
  }
  return updatedItem;
};
