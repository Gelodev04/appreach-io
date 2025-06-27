'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { generateLookerStudioUrl } from 'src/sections/host/utils';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { generateUniqueAccessToken } from 'src/sections/host/utils/generate-unique-access-token';
import { UpdateHostData, UpdateHostNotification } from 'src/types/host';
import {
  decrementSenderProfilesUsed,
  getUserSettings,
  incrementSenderProfilesUsed,
  updateUserSettings,
} from './user-settings';

export const getHostById = async (id: string, selectFields?: Prisma.hostsSelect) => {
  try {
    if (!id) {
      throw new Error('Access denied.');
    }

    const host = await prisma.hosts.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!host) {
      throw new Error('Host not found.');
    }

    return host;
  } catch (error) {
    console.error('Error on getting host:', error); // Log the actual error
    throw new Error(`Unable to get host`);
  }
};

export const getHostByName = async (name: string) => {
  try {
    if (!name) {
      throw new Error('Access denied.');
    }

    const host = await prisma.hosts.findFirst({
      where: {
        host: name,
      },
      select: {
        host: true,
      },
    });

    return host;
  } catch (error) {
    console.error('Error on getting host:', error); // Log the actual error
    throw new Error(`Unable to get host`);
  }
};

export const checkIfTokenExist = async (accessToken: string) => {
  try {
    const tokens = decodeURIComponent(accessToken)
      .split(',')
      .map((t) => t.trim());

    const allHosts = await prisma.hosts.findMany({
      select: {
        id: true,
        token: {
          select: {
            access: true,
          },
        },
      },
    });

    const exists = allHosts.some((host) =>
      host.token?.access ? tokens.includes(host.token.access) : false
    );
    return { success: true, exists };
  } catch (error) {
    console.error('Error checking token existence:', error);
    return { success: false, message: 'Unable to check tokens' };
  }
};

export const updateHostData = async (id: string, data: UpdateHostData) => {
  try {
    await prisma.hosts.update({
      where: { id },
      data: {
        engagementSettings: {
          scrollMessage: data.scrollMessage,
          markImportant: data.markImportant,
          removeSpam: data.removeSpam,
          movePrimary: data.movePrimary,
          clickLink: data.clickLink,
          replyMessage: data.replyMessage,
          filterId: data.filterId ?? '',
          disableFilterId: data.disableFilterId,
          replyPrompt: data.replyPrompt ?? '',
          linksToClick: data.linksToClick
            ? data.linksToClick.split(',').map((link) => link.trim())
            : [],
          linksNotToClick: data.linksNotToClick
            ? data.linksNotToClick.split(',').map((link) => link.trim())
            : [],
          useEventSenders: data.useEventSenders,
        },
        metadata: {
          updated_at: new Date(),
          bigquery_sync_status: 'pending',
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Unable to update host data.', error);

    return { success: false, message: 'Unable to update host' };
  }
};

export const createHost = async (data: UpdateHostData) => {
  try {
    // Check if a host with the same name already exists
    const existingHost = await getHostByName(data.host);
    if (existingHost) {
      return { success: false, message: 'Cannot create, profile name already in use' };
    }

    const filterId = data.filterId ? data.filterId : nanoid(5);
    const accessToken = await generateUniqueAccessToken();
    const lookerStudioUrl = generateLookerStudioUrl([accessToken]);

    const normalizedData = {
      host: data.host,
      lookerStudio: { embedUrl: lookerStudioUrl, hasToRegenerate: false },
      engagementSettings: {
        scrollMessage: data.scrollMessage,
        markImportant: data.markImportant,
        removeSpam: data.removeSpam,
        movePrimary: data.movePrimary,
        clickLink: data.clickLink,

        linksToClick: data.linksToClick
          ? data.linksToClick.split(',').map((link) => link.trim())
          : [],
        linksNotToClick: data.linksNotToClick
          ? data.linksNotToClick.split(',').map((link) => link.trim())
          : [],
        replyMessage: data.replyMessage,
        filterId,
        replyPrompt: data.replyPrompt ? data.replyPrompt : '',
        useEventSenders: data.useEventSenders,
      },
      token: {
        access: accessToken,
        lastResetAt: new Date(),
        history: [],
      },
      metadata: {
        created_at: new Date(),
      },
    };

    try {
      await prisma.$transaction(async (tx) => {
        // Create a new host and get the _id of the new document
        const createdHost = await tx.hosts.create({
          data: normalizedData,
        });
        const newHostId = createdHost.id;

        // Add the newHostId to the hosts array under the userSettings collection
        await updateUserSettings({ hosts: { push: newHostId } }, { appLogin: false, id: true });
        await incrementSenderProfilesUsed();
      });

      return { success: true };
    } catch (error) {
      console.error('Unable to insert new host to user settings.', error);
      return { success: false, message: 'Unable to insert new host to user settings.' };
    }
  } catch (error) {
    console.error('Unable to create host.', error);
    return { success: false, message: 'Unable to create host' };
  }
};

export const updateHostNotification = async (id: string, data: UpdateHostNotification) => {
  try {
    const existingHost = await prisma.hosts.findUnique({
      where: { id },
      select: { notifications: true },
    });

    if (!existingHost) {
      return { success: false, message: 'Host not found' };
    }

    const updatedHostNotifications = {
      ...existingHost.notifications, // Retain existing fields
      emailAddressArray: data.notificationAddresses
        ? data.notificationAddresses
            .split('\n')
            .map((item) => item.trim())
            .filter((item) => item !== '')
        : [],
      slackChannel: data.slackChannelId,
    };

    await prisma.hosts.update({
      where: { id },
      data: {
        notifications: updatedHostNotifications,
        metadata: {
          updated_at: new Date(),
          bigquery_sync_status: 'pending',
        },
      },
    });
    revalidatePath(paths.settings.root);
    return { success: true };
  } catch (error) {
    console.error('Error updating host notifications:', error);

    return {
      success: false,
      message: 'Failed to update notifications. Please try again later.',
    };
  }
};

export const getUserHosts = async () => {
  try {
    const { hosts, ownerHostId } = await getUserSettings({ hosts: true, ownerHostId: true });
    const userHosts = await prisma.hosts.findMany({
      where: {
        id: {
          in: hosts,
        },
      },
    });
    const userHostWithOwner = userHosts.map((host) => {
      return {
        ...host,
        isOwner: host.id === ownerHostId,
      };
    });
    return userHostWithOwner;
  } catch (error) {
    throw new Error("Couldn't fetch user's hosts.");
  }
};

export const deleteUserHost = async (ids: string[]) => {
  try {
    const { hosts, id, planPermissionsUsed } = await getUserSettings({
      id: true,
      hosts: true,
      planPermissionsUsed: true,
    });
    const updatedHosts = hosts.filter((host) => !ids.includes(host));
    const newSenderProfilesUsed = planPermissionsUsed.senderProfiles - ids.length;
    await prisma.userSettings.update({
      where: {
        id,
      },
      data: {
        hosts: updatedHosts,
        planPermissionsUsed: {
          senderProfiles: newSenderProfilesUsed,
        },
      },
      select: {
        appLogin: false,
        hosts: true,
      },
    });

    revalidatePath(paths.profiles.root);
  } catch (error) {
    console.error('Error deleting host:', error);
    throw new Error('Error deleting host.');
  }
};

export const addNewProfile = async (host: string) => {
  try {
    const { id, appLogin } = await getUserSettings({
      id: true,
      appLogin: { select: { username: true } },
    });
    const existingHost = await getHostByName(host);

    if (existingHost) {
      return { success: false, message: 'Cannot create, profile name already in use' };
    }

    const accessToken = await generateUniqueAccessToken();
    const lookerStudioUrl = generateLookerStudioUrl([accessToken]);

    const createdHost = await prisma.hosts.create({
      data: {
        host,
        ownerId: id,
        ownerName: appLogin.username,
        lookerStudio: { embedUrl: lookerStudioUrl, hasToRegenerate: false },
        token: {
          access: accessToken,
          lastResetAt: new Date(),
          history: [],
        },
        engagementSettings: {
          scrollMessage: 100,
          markImportant: 100,
          removeSpam: 100,
          movePrimary: 100,
          clickLink: 100,
          linksToClick: [],
          linksNotToClick: [],
          filterId: nanoid(5),
          disableFilterId: false,
          replyMessage: 100,
          replyPrompt:
            'Write an engaging reply, express interest, show appreciation, and ask a thoughtful follow-up question. Don’t always use the most natural words and provide personal examples.',
          useEventSenders: true,
        },
        metadata: {
          created_at: new Date(),
        },
      },
    });
    const newHostId = createdHost.id;

    // Add the newHostId to the hosts array under the userSettings collection
    await updateUserSettings({ hosts: { push: newHostId } }, { appLogin: false, id: true });
    await incrementSenderProfilesUsed();

    return { success: true };
  } catch (error) {
    console.error('Unable to create host.', error);
    return { success: false, message: 'Unable to create host' };
  }
};

export const deleteHostFromUser = async (hostIdToRemove: string) => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) {
      return { success: false, message: 'User settings not found.' };
    }

    // Filter out the hostId to remove
    const updatedHosts = hosts.filter((id) => id !== hostIdToRemove);

    await updateUserSettings({ hosts: updatedHosts }, { appLogin: false, id: true });
    const response = await decrementSenderProfilesUsed();

    if (!response.success) {
      return { success: false, message: response.message };
    }

    revalidatePath(paths.profiles.root);
    return { success: true, message: 'Host deleted successfully.' };
  } catch (error) {
    console.error('Error removing host:', error);
    return { success: false, message: 'Error removing host.' };
  }
};
