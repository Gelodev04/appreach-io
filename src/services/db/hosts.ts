'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';

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
