'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { generateHostCrypt, generateLookerStudioUrl } from 'src/sections/host/utils';

import { UpdateHostData } from 'src/types/host';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { updateUserSettings, getUserSettings, incrementSenderProfilesUsed } from './user-settings';

export const getHostById = async (id: string, selectFields?: Prisma.userSettingsSelect) => {
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
    throw new Error(`Unable to get host: ${error.message}`);
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
    throw new Error(`Unable to get host: ${error.message}`);
  }
};

export const updateHostData = async (id: string, data: UpdateHostData) => {
  try {
    const normalizedData = {
      engagementSettings: {
        scrollMessage: data.scrollMessage,
        markImportant: data.markImportant,
        removeSpam: data.removeSpam,
        movePrimary: data.movePrimary,
        clickLink: data.clickLink,
        replyMessage: data.replyMessage,
        filterId: data.filterId,
        replyPrompt: data.replyPrompt,
        linksToClick: data.linksToClick
          ? data.linksToClick.split(',').map((link) => link.trim())
          : [''],
        linksNotToClick: data.linksNotToClick
          ? data.linksNotToClick.split(',').map((link) => link.trim())
          : [''],
      },
      userSettings: {
        timezone: data.timezone,
      },
    };

    console.log({ normalizedData });
    const updatedHostData = await prisma.hosts.update({
      where: { id },
      data: normalizedData,
    });

    return updatedHostData;
  } catch (error) {
    console.log('Unable to update sender status to ready.', error);
    throw new Error(`Unable to update host: ${error.message}`);
  }
};

export const createHost = async (data: UpdateHostData) => {
  try {
    // Check if a host with the same name already exists
    const existingHost = await getHostByName(data.host);
    if (existingHost) throw new Error('Cannot create, profile name already in use');

    const hostCrypt = generateHostCrypt(data.host);
    const lookerStudioUrl = generateLookerStudioUrl([hostCrypt]);

    const normalizedData = {
      host: data.host,
      hostCrypt,
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
          : [''],
        linksNotToClick: data.linksNotToClick
          ? data.linksNotToClick.split(',').map((link) => link.trim())
          : [''],
        replyMessage: data.replyMessage,
        filterId: data.filterId,
        replyPrompt: data.replyPrompt,
      },
    };

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create a new host and get the _id of the new document
        const createdHost = await tx.hosts.create({
          data: normalizedData,
        });
        const newHostId = createdHost.id;

        // TODO: Update the senders useCount when added a new host

        // Add the newHostId to the hosts array under the userSettings collection
        await updateUserSettings({ hosts: { push: newHostId } }, { appLogin: false, id: true });
        await incrementSenderProfilesUsed();
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.log('Unable to create host.', error);
    throw new Error(`Unable to create host: ${error.message}`);
  }
};

export const getUserHosts = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });
    const userHosts = await prisma.hosts.findMany({
      where: {
        id: {
          in: hosts,
        },
      },
    });
    return userHosts;
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
