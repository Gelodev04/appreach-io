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
    throw new Error(`Unable to get attributes: ${error.message}`);
  }
};

export const createAttributeUploads = async (
  data: CreateAttributeUploadsPropType,
  file: string
) => {
  try {
    console.log(data, file);
  } catch (error) {
    return { error: `Unable to create email validator: ${error.message}` };
  }
};

export const emailValidatorWebhook = async () => {
  try {
    await axios.post(env.EMAIL_VALIDATOR_FUNCTION as string);
  } catch (error) {
    throw new Error('Error on email validator webhook.');
  }
};
