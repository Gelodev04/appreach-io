'use server';

import { Prisma } from '@prisma/client';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import prisma from 'src/auth/lib/prisma/db-prisma';

export const getUserSettings = async (selectFields?: Prisma.userSettingsSelect) => {
  const session = await auth();
  const id = session?.user.id;
  try {
    if (!id) {
      throw new Error('Access denied.');
    }
    const userSettings = await prisma.userSettings.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!userSettings) {
      throw new Error('No user found with the provided username.');
    }

    return userSettings;
  } catch (error) {
    console.error('Error on getting user settings:', error); // Log the actual error
    throw new Error('Error on getting user settings.', error); // Throw a user-friendly error
  }
};

export const updateUserSettings = async (
  data: Prisma.userSettingsUpdateInput,
  selectFields?: Prisma.userSettingsSelect
) => {
  try {
    const session = await auth();
    const id = session?.user.id;
    if (!id) {
      throw new Error('Access denied.');
    }
    const updatedUserSettings = await prisma.userSettings.update({
      where: {
        id,
      },
      data,
      select: selectFields,
    });

    return updatedUserSettings;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Error updating user settings.');
  }
};
export const getSenderProfiles = async () => {
  const { hosts: hostsIds } = await getUserSettings({ hosts: true });
  try {
    if (!hostsIds?.length) return [];

    const hosts = await prisma.hosts.findMany({
      where: {
        id: {
          in: hostsIds,
        },
      },
      orderBy: {
        host: 'asc',
      },
    });

    return hosts.map((host) => ({
      profile: host.host,
      id: host.id,
    }));
  } catch (error) {
    console.log('Error unable to get the sender profiles', error);
    return [];
  }
};

export const getUserSettingsByEmail = async (
  email: string,
  selectFields?: Prisma.userSettingsSelect,
  where?: Prisma.userSettingsWhereInput
) => {
  try {
    const userSettings = await prisma.userSettings.findFirst({
      where: {
        appLogin: {
          is: {
            username: email,
          },
        },
        ...where,
      },
      select: selectFields,
    });
    return userSettings;
  } catch (error) {
    console.error('Error on getting user settings by email:', error); // Log the actual error
    throw new Error('Error on getting user settings by email.'); // Throw a user-friendly error
  }
};

export const getUserSettingsById = async (id: string, selectFields?: Prisma.userSettingsSelect) => {
  try {
    if (!id) {
      throw new Error('Access denied.');
    }
    const userSettings = await prisma.userSettings.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!userSettings) {
      throw new Error('No user found with the provided id.');
    }

    return userSettings;
  } catch (error) {
    console.error('Error on getting user settings by Id', error); // Log the actual error
    throw new Error('Error on getting user settings by Id'); // Throw a user-friendly error
  }
};

export const getProfilePlanPermissions = async () => {
  try {
    const { planPermissionsAssigned, planPermissionsUsed } = await getUserSettings({
      plan: true,
      planPermissionsAssigned: true,
      planPermissionsUsed: true,
    });

    const numOfProfileUsed = planPermissionsUsed.senderProfiles;
    const numOfProfileAssigned = planPermissionsAssigned.senderProfiles;
    const isAllProfileUsed = numOfProfileUsed >= numOfProfileAssigned;
    return {
      numOfProfileAssigned,
      numOfProfileUsed,
      isAllProfileUsed,
    };
  } catch (error) {
    throw new Error('Unable to get sender profile plan permissions');
  }
};

export const getAddressesPlanPermissions = async () => {
  try {
    const { planPermissionsAssigned, planPermissionsUsed } = await getUserSettings({
      plan: true,
      planPermissionsAssigned: true,
      planPermissionsUsed: true,
    });

    const numOfAddressesUsed = planPermissionsUsed.senderAddresses;
    const numOfAddressesAssigned = planPermissionsAssigned.senderAddresses;
    const isAllAddressesUsed = numOfAddressesUsed >= numOfAddressesAssigned;
    return {
      numOfAddressesUsed,
      numOfAddressesAssigned,
      isAllAddressesUsed,
    };
  } catch (error) {
    throw new Error('Unable to get sender addresses plan permissions');
  }
};
