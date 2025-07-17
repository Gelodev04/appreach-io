'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { paths } from 'src/routes/paths';
import { ObjectId } from 'mongodb';

export const getUserSettings = async (selectFields?: Prisma.userSettingsSelect) => {
  const session = await auth();
  const id = session?.user.id;
  try {
    if (!id) {
      throw new Error('Access denied.');
    }

    const client = await clientPromise;
    const db = client.db();

    // Handle the id field mapping for MongoDB
    const includeId = selectFields?.id;
    let projection;

    if (selectFields) {
      projection = Object.entries(selectFields).reduce(
        (acc, [key, value]) => {
          // Map 'id' to '_id' for MongoDB projection
          if (key === 'id') {
            acc['_id'] = value ? 1 : 0;
          } else {
            acc[key] = value ? 1 : 0;
          }
          return acc;
        },
        {} as Record<string, 1 | 0>
      );
    }

    const userSettings = await db
      .collection('userSettings')
      .findOne({ _id: new ObjectId(id) }, { projection });

    if (!userSettings) {
      throw new Error('No user found with the provided ID.');
    }

    // If id was requested, map _id to id in the result
    if (includeId) {
      userSettings.id = userSettings._id.toString();
    }

    return userSettings;
  } catch (error) {
    console.error('Error on getting user settings:', error); // Log the actual error
    throw new Error('Failed to retrieve user settings.');
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

    return { success: true, data: updatedUserSettings };
  } catch (error) {
    console.error('Error updating user settings:', error);

    return { success: false, message: 'Failed to update user settings.' };
  }
};

export const getSenderProfiles = async () => {
  const { hosts: hostsIds } = await getUserSettings({ hosts: true });
  try {
    if (!hostsIds?.length) return { hostsWithApiKey: [], allHosts: [] };

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

    // const filteredHosts = hosts.filter(
    //   (host) => host.smartlead?.apiKey && host.smartlead.apiKey.trim() !== ''
    // );

    // const hostsWithApiKey = filteredHosts.map((host) => ({
    //   profile: host.host,
    //   id: host.id,
    // }));

    const allHosts = hosts.map((host) => ({
      profile: host.host,
      id: host.id,
    }));

    return { hostsWithApiKey: [], allHosts };
  } catch (error) {
    console.log('Error unable to get the sender profiles', error);
    return { hostsWithApiKey: [], allHosts: [] };
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

export const getSeedsPlanPermissions = async () => {
  try {
    const { planPermissionsAssigned, planPermissionsUsed } = await getUserSettings({
      plan: true,
      planPermissionsAssigned: true,
      planPermissionsUsed: true,
    });

    const numOfSeedsUsed = planPermissionsUsed.seeds;
    const numOfSeedsAssigned = planPermissionsAssigned.seeds;
    const isAllSeedsUsed = numOfSeedsUsed >= numOfSeedsAssigned;
    return {
      numOfSeedsUsed,
      numOfSeedsAssigned,
      isAllSeedsUsed,
    };
  } catch (error) {
    console.log('Unable to get seeds plan permissions', error);
    throw new Error(`Unable to get seeds plan permissions`);
  }
};

// Unused, may be added in the future
// export const getEmailValidatorPlanPermissions = async () => {
//   try {
//     const { planPermissionsAssigned, planPermissionsUsed } = await getUserSettings({
//       plan: true,
//       planPermissionsAssigned: true,
//       planPermissionsUsed: true,
//     });

//     const numOfCreditsUsed = planPermissionsUsed.verifyCredits;
//     const numOfCreditsAssigned = planPermissionsAssigned.verifyCredits;
//     const isAllCreditsUsed = numOfCreditsUsed >= numOfCreditsAssigned;
//     const remainingCredits = numOfCreditsAssigned - numOfCreditsUsed;
//     return {
//       numOfCreditsUsed,
//       numOfCreditsAssigned,
//       isAllCreditsUsed,
//       remainingCredits,
//     };
//   } catch (error) {
//     console.log('Unable to get email validator plan permissions', error);
//     throw new Error(`Unable to get email validator plan permissions`);
//   }
// };

// Unused, may be added in the future
// export const getAttributesUploadsPlanPermissions = async () => {
//   try {
//     const { planPermissionsAssigned, planPermissionsUsed } = await getUserSettings({
//       plan: true,
//       planPermissionsAssigned: true,
//       planPermissionsUsed: true,
//     });

//     const numOfAttributesUsed = planPermissionsUsed.attributeCredits;
//     const numOfAttributesAssigned = planPermissionsAssigned.attributeCredits;
//     const isAllAttributesUsed = numOfAttributesUsed >= numOfAttributesAssigned;
//     const remainingAttributes = numOfAttributesAssigned - numOfAttributesUsed;

//     return {
//       numOfAttributesUsed,
//       numOfAttributesAssigned,
//       isAllAttributesUsed,
//       remainingAttributes,
//     };
//   } catch (error) {
//     console.log('Unable to get attributes uploads plan permissions', error);
//     throw new Error(`Unable to get attributes uploads plan permissions`);
//   }
// };

// Unused, may be added in the future
// export const getSmartleadPlanPermissions = async () => {
//   try {
//     const { planPermissionsAssigned, planPermissionsUsed } = await getUserSettings({
//       plan: true,
//       planPermissionsAssigned: true,
//       planPermissionsUsed: true,
//     });

//     const numOfSmartleadUsed = planPermissionsUsed.smartLeadAccounts;
//     const numOfSmartleadAssigned = planPermissionsAssigned.smartLeadAccounts;
//     const isAllSmartleadUsed = numOfSmartleadUsed >= numOfSmartleadAssigned;
//     const remainingSmartlead = numOfSmartleadAssigned - numOfSmartleadUsed;
//     return {
//       numOfSmartleadUsed,
//       numOfSmartleadAssigned,
//       isAllSmartleadUsed,
//       remainingSmartlead,
//     };
//   } catch (error) {
//     console.log('Unable to get email validator plan permissions', error);
//     throw new Error(`Unable to get email validator plan permissions`);
//   }
// };

export const incrementSenderAddressesUsed = async () => {
  try {
    const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
    const numOfAddressesUsed = planPermissionsUsed.senderAddresses + 1;
    await updateUserSettings(
      {
        planPermissionsUsed: {
          update: {
            senderAddresses: numOfAddressesUsed,
          },
        },
      },
      { planPermissionsUsed: true }
    );
  } catch (error) {
    throw new Error('Unable to increment sender addresses used');
  }
};

export const decrementSenderAddressesUsed = async (value: number = 1) => {
  try {
    const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
    const numOfAddressesUsed = planPermissionsUsed.senderAddresses - value;
    await updateUserSettings(
      {
        planPermissionsUsed: {
          update: {
            senderAddresses: numOfAddressesUsed,
          },
        },
      },
      { planPermissionsUsed: true }
    );
    revalidatePath(paths.senders.root);
  } catch (error) {
    throw new Error('Unable to increment sender addresses used');
  }
};

export const decrementSenderProfilesUsed = async (value: number = 1) => {
  try {
    const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
    const numOfProfilesUsed = planPermissionsUsed.senderProfiles - value;
    await updateUserSettings(
      {
        planPermissionsUsed: {
          update: {
            senderProfiles: numOfProfilesUsed,
          },
        },
      },
      { planPermissionsUsed: true }
    );

    return { success: true, message: 'Sender profiles updated.' };
  } catch (error) {
    console.error('Unable to decrement sender profiles used:', error);
    return { success: false, message: 'Unable to update sender profiles.' };
  }
};

export const incrementSenderProfilesUsed = async () => {
  try {
    const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
    const numOfProfileUsed = planPermissionsUsed.senderProfiles + 1;
    await updateUserSettings(
      { planPermissionsUsed: { update: { senderProfiles: numOfProfileUsed } } },
      { planPermissionsUsed: true }
    );
    revalidatePath(paths.senders.root);
  } catch (error) {
    throw new Error('Unable to increment sender profiles used');
  }
};

// export const incrementVerifyCreditsUsed = async () => {
//   try {
//     const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
//     const numOfVerifyCreditsUsed = planPermissionsUsed.verifyCredits + 1;
//     await updateUserSettings(
//       { planPermissionsUsed: { update: { verifyCredits: numOfVerifyCreditsUsed } } },
//       { planPermissionsUsed: true }
//     );
//   } catch (error) {
//     throw new Error('Unable to increment verify credits used');
//   }
// };

// export const incrementAttributeCreditsUsed = async () => {
//   try {
//     const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
//     const numOfAttributeCreditsUsed = planPermissionsUsed.attributeCredits + 1;
//     await updateUserSettings(
//       { planPermissionsUsed: { update: { attributeCredits: numOfAttributeCreditsUsed } } },
//       { planPermissionsUsed: true }
//     );
//   } catch (error) {
//     throw new Error('Unable to increment verify credits used');
//   }
// };
