import { hosts } from '@prisma/client';
import { useEffect, useState } from 'react';
import { defaultEngagementSettings } from 'src/constants';

export const useSetValues = (currentItem: hosts | undefined) => {
  const [hostItem, setHostItem] = useState<hosts | undefined>(currentItem);

  useEffect(() => {
    if (currentItem) {
      const updatedHostItem = {
        ...currentItem,
        engagementSettings: currentItem.engagementSettings
          ? currentItem.engagementSettings
          : defaultEngagementSettings.engagementSettings,
      };

      setHostItem(updatedHostItem);
    }
  }, [currentItem]);

  return hostItem;
};
