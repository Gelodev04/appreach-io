'use server';

import axios from 'axios';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { env } from 'src/data/env/server';
import { CreateAttributeUploadsPropType } from 'src/types/attribute-uploads';
import { getUserSettings } from './user-settings';

export const getAttributesUploadsByHostIds = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) throw new Error(`Unable to get hosts`);

    const attributes = await prisma.attributeUploads.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
    });

    return attributes;
  } catch (error) {
    console.error('Error on getting attributes:', error); // Log the actual error
    throw new Error(`Unable to get attributes`);
  }
};

export const createAttributeUploads = async (
  data: CreateAttributeUploadsPropType,
  file: string,
  columnMappings: string[]
) => {
  try {
    await prisma.attributeUploads.create({
      data: {
        csvLink: file,
        hostId: data.hostId.value,
        hostName: data.hostId.label,
        importName: data.name,
        importSource: data.importSource.value,
        updateExisting: data.updateExisting,
        status: 'ready',
        columnMappings: columnMappings,
      },
    });
  } catch (error) {
    return { error: `Unable to create email validator: ${error.message}` };
  }
};

export const attributeUploadsWebhook = async () => {
  try {
    await axios.post(env.ATTRIBUTE_UPLOADS_FUNCTION as string);
  } catch (error) {
    throw new Error('Error on attribute uploads webhook.');
  }
};
