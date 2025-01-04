import { hosts } from '@prisma/client';
import { defaultEngagementSettings } from 'src/constants';

export const useDefaultEngagementSettings = (currentItem?: hosts) => {
  let updatedItem: hosts | undefined = currentItem;
  console.log({ currentItem });
  if (!currentItem?.engagementSettings && currentItem?.id) {
    updatedItem = {
      ...currentItem,
      engagementSettings: defaultEngagementSettings.engagementSettings,
    };
  }
  console.log({ updatedItem });
  return updatedItem;
};
