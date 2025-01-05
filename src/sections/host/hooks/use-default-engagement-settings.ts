import { hosts } from '@prisma/client';
import { defaultEngagementSettings } from 'src/constants';
import { HostProps } from 'src/types/host';

export const useDefaultEngagementSettings = ({ currentItem, planPermissions }: HostProps) => {
  let features = planPermissions.engagementFeatures;
  let updatedItem: hosts | undefined = currentItem;

  if (!currentItem?.engagementSettings && currentItem?.id) {
    updatedItem = {
      ...currentItem,
      engagementSettings: defaultEngagementSettings.engagementSettings,
    };
  }
  return updatedItem;
};
