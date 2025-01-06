'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';
import {
  generateArrayAddresses,
  retrieveDuplicateAddresses,
} from 'src/sections/host/utils/generate-array-adresses';
import { UpdateHostData } from 'src/types/host';

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
        externalSenderAddresses: data.externalSenderAddresses
          ? data.externalSenderAddresses.split('\n').map((link) => link.trim())
          : [''],
      },
    };

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

export const createHost = async (data: UpdateHostData, hosts: string[] | undefined) => {
  try {
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

    // Check if a host with the same name already exists
    const existingHost = await getHostByName(data.host);
    if (existingHost) throw new Error('Cannot create, profile name already in use');

    // Check for duplicate external sender addresses across user hosts
    if (data.externalSenderAddresses) {
      const userHosts = hosts as string[];
      const externalSenderAddressesArray = generateArrayAddresses(data.externalSenderAddresses);
      const hostsData = await prisma.hosts.findMany({
        where: {
          id: { in: userHosts },
        },
        select: {
          id: true,
          userSettings: {
            select: {
              externalSenderAddresses: true,
            },
          },
        },
      });

      const duplicates = retrieveDuplicateAddresses({ hostsData, externalSenderAddressesArray });
      // If there are duplicates, throw the error
      if (duplicates.length > 0) {
        throw new Error(
          `Cannot create, sender address(es) "${duplicates.join(', ')}" already in use.`
        );
      }

      console.log({
        test: hostsData[0].userSettings?.externalSenderAddresses,
        externalSenderAddressesArray,
      });
    }

    // const createdHost = await prisma.hosts.create({
    //   data: normalizedData,
    // });

    // return createdHost;
  } catch (error) {
    console.log('Unable to create host.', error);
    throw new Error(`Unable to create host: ${error.message}`);
  }
};
