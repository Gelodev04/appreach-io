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

    const attributes = await prisma.attribute_uploads.findMany({
      where: {
        host_id: {
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
  columnMappings: Record<string, string>
) => {
  try {
    const { id } = await getUserSettings({ id: true });

    await prisma.attribute_uploads.create({
      data: {
        csv_link: file,
        host_id: data.host_id.value,
        host_name: data.host_id.label,
        import_name: data.name,
        import_source: data.import_source.value,
        update_existing: data.update_existing,
        metadata: {
          processing_status: 'ready',
        },
        column_mappings: columnMappings,
        user_id: id,
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
