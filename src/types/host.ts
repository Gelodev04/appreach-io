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

interface IToken {
  access: string;
  lastResetAt: string;
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

export type senderEmail = {
  email?: string;
};

export interface HostProps {
  currentItem?: hosts;
  planPermissions: {
    seeds: number;
    planPermissionFeatures: UserSettingsPlanPermissionFeatures;
    engagementMax: number;
  };
  emails?: senderEmail[];
}

export type UpdateHostData = {
  host: string;
  scrollMessage: number;
  markImportant: number;
  removeSpam: number;
  movePrimary: number;
  clickLink: number;
  replyMessage: number;
  filterId?: string;
  disableFilterId?: boolean;
  replyPrompt?: string;
  linksToClick?: string;
  linksNotToClick?: string;
  useEventSenders?: boolean;
};

export type UpdateHostNotification = {
  notificationAddresses?: string;
  slackChannelId?: string;
};

export interface IHost {
  _id: ObjectId;
  host: string;
  hostCrypt: string;
  slack: ISlack;
  userSettings: IUserSettings;
  lookerStudio: ILookerStudio;
  smartlead: ISmartlead;
  inboxEngagement: IInboxEngagement;
  token: IToken;
}
