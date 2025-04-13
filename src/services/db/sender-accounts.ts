'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { paths } from 'src/routes/paths';
import { CreateSenderAccountData } from 'src/types/sender-account';
import { getHostById } from './hosts';
import { getUserSettings } from './user-settings';

export const getSenderAccountByHostIdsAndType = async ({ type }: { type: string }) => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) throw new Error(`Unable to get hosts`);

    const senders = await prisma.sender_accounts.findMany({
      where: {
        host_id: {
          in: hosts,
        },
        type,
      },
    });

    return senders;
  } catch (error) {
    console.error('Error on getting senders:', error);
    throw new Error(`Unable to get senders`);
  }
};

export const getSenderAccountsByHostId = async (
  hostId: string,
  selectFields?: Prisma.sender_accountsSelect
) => {
  try {
    const senders = await prisma.sender_accounts.findMany({
      where: {
        host_id: hostId,
      },
      select: selectFields,
    });

    return senders;
  } catch (error) {
    console.error('Error on getting senders:', error);
    throw new Error(`Unable to get senders`);
  }
};

export const getSenderAccountBySender = async (sender: string) => {
  try {
    if (!sender) {
      throw new Error('Access denied.');
    }

    const senderItem = await prisma.sender_accounts.findFirst({
      where: {
        sender,
      },
      select: {
        host_name: true,
      },
    });

    return senderItem;
  } catch (error) {
    console.error('Error on getting sender:', error);
    throw new Error(`Unable to get sender`);
  }
};

export const getSenderAccountById = async (
  id: string,
  selectFields?: Prisma.sender_accountsSelect
) => {
  try {
    const senderItem = await prisma.sender_accounts.findFirst({
      where: {
        id,
      },
      select: selectFields,
    });

    return senderItem;
  } catch (error) {
    console.error('Error on getting sender:', error);
    throw new Error(`Unable to get sender`);
  }
};

export const createSenderAccount = async (data: CreateSenderAccountData) => {
  try {
    const { id: user_id } = await getUserSettings({
      id: true,
    });

    const { hostCrypt } = await getHostById(data.hostId!.value, { hostCrypt: true });

    const normalizedLinkedInUrl = data.linkedinUrl
      .replace(/^https:\/\/www\./, '') // Remove "https://www.linkedin.com/"
      .replace(/\/$/, ''); // Remove trailing "/"

    // Check if a sender with the same url already exists
    const existingSender = await getSenderAccountBySender(normalizedLinkedInUrl);
    if (existingSender) {
      return {
        success: false,
        message: `Sender already exists in ${
          existingSender.host_name
        }. Contact support if you have questions.`,
      };
    }

    const normalizedData = {
      user_id,
      host_id: data.hostId!.value,
      host_name: data.hostId!.label,
      host_crypt: hostCrypt,
      sender: normalizedLinkedInUrl,
      sender_name: data.senderName,
      platform: 'non-api',
      type: 'linkedin',
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        bigquery_sync_status: 'pending',
      },
    };

    await prisma.sender_accounts.create({
      data: normalizedData,
    });

    revalidatePath(paths.senders.linkedin);
    return { success: true };
  } catch (error) {
    console.error('Unable to create host.', error);
    return { success: false, message: 'Unable to create sender account.' };
  }
};

export const updateSenderAccountHost = async (
  id: string,
  host: { hostId: string; hostName: string }
) => {
  try {
    // Get Existing data
    const senderItem = await getSenderAccountById(id, { metadata: true });

    if (!senderItem) {
      throw new Error('Sender account not found');
    }

    const { metadata } = senderItem;

    const data = {
      where: {
        id,
      },
      data: {
        host_id: host.hostId,
        host_name: host.hostName,
        metadata: {
          ...metadata, // Retain existing fields
          updated_at: new Date(),
        },
      },
    };

    await prisma.sender_accounts.update(data);
    revalidatePath(paths.senders.linkedin);

    return { success: true };
  } catch (error) {
    console.error('Error on Sender Account Host Update:', error);

    return {
      success: false,
      message: 'Failed to update sender account host. Please try again later.',
    };
  }
};

export const updateSenderAccountPlatform = async (
  id: string,
  platform: { label: string; value: string },
  path: string
) => {
  try {
    // Get Existing data
    const senderItem = await getSenderAccountById(id, { metadata: true });

    if (!senderItem) {
      throw new Error('Sender account not found');
    }

    const { metadata } = senderItem;

    const data = {
      where: {
        id,
      },
      data: {
        platform: platform.value,
        metadata: {
          ...metadata, // Retain existing fields
          updated_at: new Date(),
          bigquery_sync_status: 'pending',
        },
      },
    };

    await prisma.sender_accounts.update(data);
    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error on Sender Account Platform Update:', error);

    return {
      success: false,
      message: 'Failed to update sender account platform. Please try again later.',
    };
  }
};

export const updateSenderAccountEmailServer = async (
  id: string,
  emailServer: { label: string; value: string },
  path: string
) => {
  try {
    // Get Existing data
    const senderItem = await getSenderAccountById(id, { metadata: true });

    if (!senderItem) {
      throw new Error('Sender account not found');
    }

    const { metadata } = senderItem;

    const data = {
      where: {
        id,
      },
      data: {
        email_server: emailServer.value,
        metadata: {
          ...metadata, // Retain existing fields
          bigquery_sync_status: 'pending',
        },
      },
    };

    await prisma.sender_accounts.update(data);
    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error on Sender Account Email Server Update:', error);

    return {
      success: false,
      message: 'Failed to update sender account email server. Please try again later.',
    };
  }
};

export const updateSenderAccountEmailReseller = async (
  id: string,
  emailReseller: { label: string; value: string },
  path: string
) => {
  try {
    // Get Existing data
    const senderItem = await getSenderAccountById(id, { metadata: true });

    if (!senderItem) {
      throw new Error('Sender account not found');
    }

    const { metadata } = senderItem;

    const data = {
      where: {
        id,
      },
      data: {
        email_reseller: emailReseller.value,
        metadata: {
          ...metadata, // Retain existing fields
          bigquery_sync_status: 'pending',
        },
      },
    };

    await prisma.sender_accounts.update(data);
    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error on Sender Account Email Reseller Update:', error);

    return {
      success: false,
      message: 'Failed to update sender account email reseller. Please try again later.',
    };
  }
};

export const deleteSenderAccountById = async (id: string, path: string) => {
  try {
    await prisma.sender_accounts.delete({
      where: { id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log('Unable to delete', error);
    return {
      error: error.message,
    };
  }
};

export const deleteMultipleSenderAccountsById = async (ids: string[], path: string) => {
  try {
    await prisma.sender_accounts.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Unable to delete sender accounts:', error);
    return { success: false, message: 'Unable to delete sender accounts.' };
  }
};

export const updateMultipleSenderAccountsServer = async (
  ids: string[],
  value: string,
  path: string
) => {
  try {
    // Fetch existing sender accounts metadata
    const senderAccounts = await prisma.sender_accounts.findMany({
      where: { id: { in: ids } },
      select: { id: true, metadata: true },
    });

    // Prepare bulk update payload
    const updatePromises = senderAccounts.map((account) =>
      prisma.sender_accounts.update({
        where: { id: account.id },
        data: {
          email_server: value,
          metadata: {
            ...account.metadata, // Retain existing metadata fields
            updated_at: new Date(),
            bigquery_sync_status: 'pending',
          },
        },
      })
    );

    // Execute all updates concurrently
    await Promise.all(updatePromises);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Error updating sender account records:', error);
    return {
      success: false,
      message: 'Failed to update sender account records. Please try again later.',
    };
  }
};

export const updateMultipleSenderAccountsReseller = async (
  ids: string[],
  value: string,
  path: string
) => {
  try {
    // Fetch existing sender accounts metadata
    const senderAccounts = await prisma.sender_accounts.findMany({
      where: { id: { in: ids } },
      select: { id: true, metadata: true },
    });

    // Prepare bulk update payload
    const updatePromises = senderAccounts.map((account) =>
      prisma.sender_accounts.update({
        where: { id: account.id },
        data: {
          email_reseller: value,
          metadata: {
            ...account.metadata, // Retain existing metadata fields
            updated_at: new Date(),
            bigquery_sync_status: 'pending',
          },
        },
      })
    );

    // Execute all updates concurrently
    await Promise.all(updatePromises);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Error updating sender account records:', error);
    return {
      success: false,
      message: 'Failed to update sender account records. Please try again later.',
    };
  }
};

export const updateMultipleSenderAccountsPlatform = async (
  ids: string[],
  value: string,
  path: string
) => {
  try {
    // Fetch existing sender accounts metadata
    const senderAccounts = await prisma.sender_accounts.findMany({
      where: { id: { in: ids } },
      select: { id: true, metadata: true },
    });

    // Prepare bulk update payload
    const updatePromises = senderAccounts.map((account) =>
      prisma.sender_accounts.update({
        where: { id: account.id },
        data: {
          platform: value,
          metadata: {
            ...account.metadata, // Retain existing metadata fields
            updated_at: new Date(),
            bigquery_sync_status: 'pending',
          },
        },
      })
    );

    // Execute all updates concurrently
    await Promise.all(updatePromises);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Error updating sender account records:', error);
    return {
      success: false,
      message: 'Failed to update sender account records. Please try again later.',
    };
  }
};

export const updateMultipleSenderAccountsHost = async (
  ids: string[],
  host_id: string,
  host_name: string,
  path: string
) => {
  try {
    // Fetch existing sender accounts metadata
    const senderAccounts = await prisma.sender_accounts.findMany({
      where: { id: { in: ids } },
      select: { id: true, metadata: true },
    });

    // Prepare bulk update payload
    const updatePromises = senderAccounts.map((account) =>
      prisma.sender_accounts.update({
        where: { id: account.id },
        data: {
          host_id,
          host_name,
          metadata: {
            ...account.metadata, // Retain existing metadata fields
            updated_at: new Date(),
            bigquery_sync_status: 'pending',
          },
        },
      })
    );

    // Execute all updates concurrently
    await Promise.all(updatePromises);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Error updating sender account records:', error);
    return {
      success: false,
      message: 'Failed to update sender account records. Please try again later.',
    };
  }
};
