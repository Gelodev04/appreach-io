import { hosts, UserSettingsPlanPermissionFeatures } from '@prisma/client';
import { ObjectId } from 'mongodb';

interface ILookerStudio {
  embedUrl: string;
  hasToRegenerate: boolean;
}

interface ISlack {
  notificationChannelId: string;
}

interface IUserSettings {
  timezone: string;
  notificationAddressArray: string[];
  externalSenderAddresses: string[];
}

interface ISmartlead {
  apiKey: string;
  webhook: string;
}

interface IInboxEngagement {
  markImportant: boolean;
  removeSpam: boolean;
  replyMessage: boolean;
  clickLink: boolean;
  downloadMessage: boolean;
  movePrimary: boolean;
  scrollMessage: boolean;
}

export interface HostProps {
  currentItem?: hosts;
  planPermissions: {
    seeds: number;
    planPermissionFeatures: UserSettingsPlanPermissionFeatures;
  };
}

export interface IHost {
  _id: ObjectId;
  host: string;
  hostCrypt: string;
  slack: ISlack;
  userSettings: IUserSettings;
  lookerStudio: ILookerStudio;
  smartlead: ISmartlead;
  inboxEngagement: IInboxEngagement;
}
