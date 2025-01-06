'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { getUserSettings } from './user-settings';

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
    throw new Error('Failed to fetch host details.');
  }
};

export type hostData = {
  scrollMessage: number;
  markImportant: number;
  removeSpam: number;
  movePrimary: number;
  clickLink: number;
  replyMessage: number;
  filterId: string;
  replyPrompt: string;
  linksToClick?: string | string[];
  linksNotToClick: string | string[];

  timezone: string;
  externalSenderAddresses: string | string[];
};

export const updateHostData = async (id: string, data: hostData) => {
  try {
    console.log({ data });

    // const normalizedData = {
    //   engagementSettings: {
    //     scrollMessage: data.scrollMessage,
    //     markImportant: data.markImportant,
    //     removeSpam: data.removeSpam,
    //     movePrimary: data.movePrimary,
    //     clickLink: data.clickLink,
    //     replyMessage: data.replyMessage,
    //     filterId: data.filterId,
    //     replyPrompt: data.replyPrompt,
    //     linksToClick: data.linksToClick
    //       ? data.linksToClick.split(',').map((link) => link.trim())
    //       : [''],
    //     linksNotToClick: data.linksNotToClick
    //       ? data.linksNotToClick.split(',').map((link) => link.trim())
    //       : [''],
    //   },
    //   userSettings: {
    //     timezone: data.timezone,
    //     externalSenderAddresses: data.externalSenderAddresses
    //       ? data.externalSenderAddresses.split('\n').map((link) => link.trim())
    //       : [''],
    //   },
    // };

    // const updatedHostData = await prisma.hosts.update({
    //   where: { id },
    //   data: normalizedData,
    // });

    // return updatedHostData;
  } catch (error) {
    console.log('Unable to update sender status to ready.', error);
    throw new Error('Unable to update sender status to ready.', error);
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
