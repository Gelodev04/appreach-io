'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { generateHostCrypt, generateLookerStudioUrl } from 'src/sections/host/utils';

import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { UpdateHostData, UpdateSmartLead } from 'src/types/host';
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

export const updateHostData = async (id: string, data: UpdateHostData) => {
  try {
    // Fetch current host data
    const existingHost = await prisma.hosts.findUnique({
      where: { id },
      select: { userSettings: true }, // Only fetch userSettings
    });

    if (!existingHost) {
      return { success: false, message: 'Host not found' };
    }
    const updatedUserSettings = {
      ...existingHost.userSettings, // Retain existing fields

      // Ensure all array fields are always arrays
      autoExcludeAddresses: existingHost.userSettings?.autoExcludeAddresses ?? [],
      autoExcludeDomains: existingHost.userSettings?.autoExcludeDomains ?? [],
      autoExcludeUsernames: existingHost.userSettings?.autoExcludeUsernames ?? [],
      ccAddressArray: existingHost.userSettings?.ccAddressArray ?? [],
      externalSenderAddresses: existingHost.userSettings?.externalSenderAddresses ?? [],
      leadCategories: existingHost.userSettings?.leadCategories ?? [],
      notificationAddressArray: existingHost.userSettings?.notificationAddressArray ?? [],
      warmupTags: existingHost.userSettings?.warmupTags ?? [],

      // Keep timezone update
      timezone: data.timezone,
    };

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
        },
        userSettings: updatedUserSettings, // Update with merged settings
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

    const hostCrypt = generateHostCrypt(data.host);
    const lookerStudioUrl = generateLookerStudioUrl([hostCrypt]);

    const normalizedData = {
      host: data.host,
      hostCrypt,
      smartlead: {
        webhook: `https://api.outreachmagic.io/KIs96Yu9HQSy/${hostCrypt}`,
      },
      userSettings: {
        timezone: data.timezone,
      },
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
        filterId: data.filterId ? data.filterId : '',
        replyPrompt: data.replyPrompt ? data.replyPrompt : '',
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

export const updateHostSmartlead = async (id: string, data: UpdateSmartLead) => {
  try {
    const existingHost = await prisma.hosts.findUnique({
      where: { id },
      select: { smartlead: true },
    });

    if (!existingHost) {
      return { success: false, message: 'Host not found' };
    }

    const updatedHostSmartlead = {
      ...existingHost.smartlead, // Retain existing fields
      apiKey: data.apiKey,
      useWithSeeds: data.useWithSeeds,
      notificationAddresses: data.notificationAddresses
        ? data.notificationAddresses
            .split('\n')
            .map((item) => item.trim())
            .filter((item) => item !== '')
        : [],
    };

    await prisma.hosts.update({
      where: { id },
      data: {
        smartlead: updatedHostSmartlead,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating host smartlead:', error);

    return {
      success: false,
      message: 'Failed to update smartlead. Please try again later.',
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

    const hostCrypt = generateHostCrypt(host);
    const lookerStudioUrl = generateLookerStudioUrl([hostCrypt]);

    const createdHost = await prisma.hosts.create({
      data: {
        host,
        hostCrypt,
        ownerId: id,
        ownerName: appLogin.username,
        userSettings: {
          timezone: '',
          externalSenderAddresses: [],
          notificationAddressArray: [],
        },
        lookerStudio: { embedUrl: lookerStudioUrl, hasToRegenerate: false },
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
