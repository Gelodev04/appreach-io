'use server';

import axios from 'axios';
import { ObjectId } from 'mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { env } from 'src/data/env/server';
import {
  CompanyAttributesPropType,
  CompanyMissingAttributes,
  CreateAttributeUploadsPropType,
  PersonAttributesPropType,
  PositiveLead,
} from 'src/types/attribute-uploads';
import { parseCompanyId, splitFirstUnderscore } from 'src/utils';
import { getHostById } from './hosts';
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
    const { hostCrypt } = await getHostById(data.host_id.value, { hostCrypt: true });

    await prisma.attribute_uploads.create({
      data: {
        csv_link: file,
        host_id: data.host_id.value,
        host_name: data.host_id.label,
        host_crypt: hostCrypt,
        import_name: data.name,
        metadata: {
          processing_status: 'pending',
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
    const res = await axios.post(env.ATTRIBUTE_UPLOADS_FUNCTION as string);
  } catch (error) {
    throw new Error('Error on attribute uploads webhook.');
  }
};

export const getPositiveLeadsWithAttributes = async (): Promise<PositiveLead[]> => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts || hosts.length === 0) {
      throw new Error('Unable to get hosts');
    }

    const client = await clientPromise;
    const db = client.db();

    const pipeline = [
      {
        $match: {
          host_id: { $in: hosts },
          lead_status_sentiment: 'positive',
        },
      },
      { $unwind: '$persons' },
      {
        $project: {
          persons: 1,
          host_id: 1,
          host_name: 1,
        },
      },
      {
        $addFields: {
          personObjectIdForLookup: {
            $cond: {
              if: { $eq: [{ $type: '$persons.person_id' }, 'string'] },
              then: {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: '$persons.person_id',
                      regex: /^[0-9a-fA-F]{24}$/,
                    },
                  },
                  then: { $toObjectId: '$persons.person_id' },
                  else: null,
                },
              },
              else: '$persons.person_id',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'person_attributes',
          localField: 'personObjectIdForLookup',
          foreignField: '_id',
          as: 'person_attribute_details',
        },
      },
      {
        $addFields: {
          attribute_details: {
            $ifNull: [{ $arrayElemAt: ['$person_attribute_details', 0] }, {}],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            host_id: {
              $toObjectId: '$host_id',
            },
            host_name: '$host_name',
            persons_array_id: '$persons.persons_array_id',
            person_updated_at: {
              $toDate: '$persons.person_updated_at',
            },
            person_attributes_id: '$attribute_details._id',
            email: {
              $ifNull: ['$attribute_details.email', '$persons.email'],
            },
            linkedin_company_url: '$attribute_details.linkedin_company_url',
            first_name: '$attribute_details.first_name',
            last_name: '$attribute_details.last_name',
            linkedin_url: {
              $ifNull: ['$attribute_details.linkedin_url', '$persons.linkedin'],
            },
            job_title: '$attribute_details.job_title',
            reporting_location: '$attribute_details.reporting_location',
          },
        },
      },
    ];

    const results = await db.collection('leads_missing_attributes').aggregate(pipeline).toArray();

    const plainResults: PositiveLead[] = results.map((item) => ({
      host_id: item.host_id?.toString?.(),
      host_name: item.host_name,
      persons_array_id: item.persons_array_id,
      person_updated_at: item.person_updated_at,
      person_attributes_id: item.person_attributes_id?.toString?.(),
      email: item.email,
      first_name: item.first_name,
      last_name: item.last_name,
      linkedin_company_url: item.linkedin_company_url,
      linkedin_url: item.linkedin_url,
      job_title: item.job_title,
      reporting_location: item.reporting_location,
    }));

    return plainResults;
  } catch (error) {
    console.error('Error in getPositiveLeadsWithAttributes:', error);
    throw new Error('Failed to get enriched lead data');
  }
};

export const updatePersonMissingAttributes = async (id: string, data: PersonAttributesPropType) => {
  try {
    const baseId = splitFirstUnderscore(id);

    const { id: user_id } = await getUserSettings({ id: true });
    // Get Existing data
    const personAttribute = await getPersonAttributes(baseId);

    if (personAttribute?.id) {
      await prisma.person_attributes.update({
        where: { id: personAttribute.id },
        data: {
          email: data.email || personAttribute.email,
          first_name: data.first_name || personAttribute.first_name,
          last_name: data.last_name || personAttribute.last_name,
          linkedin_url: data.linkedin_url || personAttribute.linkedin_url,
          linkedin_company_url: data.linkedin_company_url || personAttribute.linkedin_company_url,
          job_title: data.job_title || personAttribute.job_title,
          domain: data.email?.split('@')[1] || personAttribute.domain,
          reporting_location: data.reporting_location || personAttribute.reporting_location,

          metadata: {
            created_at: personAttribute.metadata?.created_at || new Date(),
            bigquery_sync_status: 'pending',
            updated_at: new Date(),
          },
          update_history: {
            push: {
              user_id,
              source: 'webapp',
              webapp: true,
              updated_at: new Date(),
            },
          },
        },
      });

      await updateMissingAttributesPersonId(id);
    } else {
      const newDoc = await prisma.person_attributes.create({
        data: {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          linkedin_url: data.linkedin_url,
          linkedin_company_url: data.linkedin_company_url,
          job_title: data.job_title,
          domain: data.email?.split('@')[1],
          reporting_location: data.reporting_location,
          metadata: {
            created_at: new Date(),
            bigquery_sync_status: 'pending',
            updated_at: new Date(),
          },
          update_history: [
            {
              user_id,
              source: 'webapp',
              webapp: true,
              updated_at: new Date(),
            },
          ],
        },
      });

      await updateMissingAttributesPersonId(id, newDoc.id);
    }

    // revalidatePath(paths.attributesUpload.missing);
    return { success: true };
  } catch (error) {
    console.error('Error on person attribute update:', error);

    return {
      success: false,
      message: 'Failed to update person attribute. Please try again later.',
    };
  }
};

export const getCompanyMissingAttributes = async (): Promise<CompanyMissingAttributes[]> => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts || hosts.length === 0) {
      throw new Error('Unable to get hosts');
    }

    const client = await clientPromise;
    const db = client.db();

    const pipeline = [
      {
        $match: {
          host_id: { $in: hosts },
          lead_status_sentiment: 'positive',
        },
      },
      {
        $unwind: '$companies',
      },
      {
        $project: {
          companies: 1,
          host_id: 1,
          host_name: 1,
        },
      },
      {
        $addFields: {
          companyObjectIdForLookup: {
            $cond: {
              if: { $eq: [{ $type: '$companies.company_id' }, 'string'] },
              then: {
                $cond: {
                  if: {
                    $regexMatch: { input: '$companies.company_id', regex: /^[0-9a-fA-F]{24}$/ },
                  },
                  then: { $toObjectId: '$companies.company_id' },
                  else: null,
                },
              },
              else: '$companies.company_id',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'company_attributes',
          localField: 'companyObjectIdForLookup',
          foreignField: '_id',
          as: 'company_attribute_details',
        },
      },
      {
        $addFields: {
          company_attribute_item: {
            $ifNull: [{ $arrayElemAt: ['$company_attribute_details', 0] }, {}],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            host_id: { $toObjectId: '$host_id' },
            host_name: '$host_name',
            companies_array_id: '$companies.companies_array_id',
            company_updated_at: { $toDate: '$companies.company_updated_at' },
            company_attributes_id: '$company_attribute_item._id',
            company_name: '$company_attribute_item.name',
            industry: '$company_attribute_item.industry',
            employee_count: '$company_attribute_item.employee_count',
            company_domain: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ['$companies.company_domain', null] },
                    { $ne: ['$companies.company_domain', ''] },
                  ],
                },
                then: '$companies.company_domain',
                else: '$company_attribute_item.domain',
              },
            },
            company_linkedin_url: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ['$companies.company_linkedin_url', null] },
                    { $ne: ['$companies.company_linkedin_url', ''] },
                  ],
                },
                then: '$companies.company_linkedin_url',
                else: '$company_attribute_item.linkedin_url',
              },
            },
          },
        },
      },
    ];

    const results = await db.collection('leads_missing_attributes').aggregate(pipeline).toArray();

    const plainResults: CompanyMissingAttributes[] = results.map((item) => ({
      host_id: item.host_id?.toString?.(),
      host_name: item.host_name,
      companies_array_id: item.companies_array_id,
      company_updated_at: item.company_updated_at,
      company_attributes_id: item.company_attributes_id?.toString?.(),
      company_name: item.company_name,
      industry: item.industry,
      employee_count: item.employee_count,
      company_domain: item.company_domain,
      company_linkedin_url: item.company_linkedin_url,
    }));

    return plainResults;
  } catch (error) {
    console.error('Error in getCompanyMissingAttributes:', error);
    throw new Error('Failed to get enriched lead data');
  }
};

export const updateCompanyMissingAttributes = async (
  id: string,
  data: CompanyAttributesPropType
) => {
  try {
    const { baseId, linkedIn } = parseCompanyId(id);

    const { id: user_id } = await getUserSettings({ id: true });
    // Get Existing data
    const companyAttribute = await getCompanyAttributes(baseId, linkedIn);

    if (companyAttribute?.id) {
      await prisma.company_attributes.update({
        where: { id: companyAttribute.id },
        data: {
          name: data.company_name || companyAttribute.name,
          domain: data.company_domain || companyAttribute.domain,
          linkedin_url: data.company_linkedin_url || companyAttribute.linkedin_url,
          industry: data.industry || companyAttribute.industry,
          employee_count: Number(data.employee_count) || companyAttribute.employee_count,
          metadata: {
            created_at: companyAttribute.metadata?.created_at || new Date(),
            bigquery_sync_status: 'pending',
            updated_at: new Date(),
          },
          update_history: {
            push: {
              user_id,
              source: 'webapp',
              webapp: true,
              updated_at: new Date(),
            },
          },
        },
      });

      await updateMissingAttributesComapnyId(baseId);
    } else {
      const newDoc = await prisma.company_attributes.create({
        data: {
          name: data.company_name,
          domain: data.company_domain,
          linkedin_url: data.company_linkedin_url,
          industry: data.industry,
          employee_count: Number(data.employee_count),
          metadata: {
            created_at: new Date(),
            bigquery_sync_status: 'pending',
            updated_at: new Date(),
          },
          update_history: [
            {
              user_id,
              source: 'webapp',
              webapp: true,
              updated_at: new Date(),
            },
          ],
        },
      });

      await updateMissingAttributesComapnyId(baseId, newDoc.id);
    }

    // revalidatePath(paths.attributesUpload.missing);
    return { success: true };
  } catch (error) {
    console.error('Error on company attribute update:', error);

    return {
      success: false,
      message: 'Failed to update company attribute. Please try again later.',
    };
  }
};

const updateMissingAttributesPersonId = async (identifier: string, newId?: string) => {
  const client = await clientPromise;
  const db = client.db();

  let filter;

  if (ObjectId.isValid(identifier)) {
    filter = { 'persons.person_id': identifier };
  } else {
    filter = { 'persons.persons_array_id': identifier };
  }
  const setObject: Record<string, any> = {
    'persons.$.person_updated_at': new Date().toISOString(),
  };

  if (newId) {
    setObject['persons.$.person_id'] = newId;
  }

  const result = await db.collection('leads_missing_attributes').updateOne(filter, {
    $set: setObject,
  });

  return result.modifiedCount > 0;
};

const updateMissingAttributesComapnyId = async (identifier: string, newId?: string) => {
  const client = await clientPromise;
  const db = client.db();

  let filter;

  if (ObjectId.isValid(identifier)) {
    filter = { 'companies.company_id': identifier };
  } else {
    filter = { 'companies.companies_array_id': identifier };
  }

  //  update company_updated_at
  const setObject: Record<string, any> = {
    'companies.$.company_updated_at': new Date().toISOString(),
  };

  // Only update company_id if newId is provided
  if (newId) {
    setObject['companies.$.company_id'] = newId;
  }

  const result = await db.collection('leads_missing_attributes').updateOne(filter, {
    $set: setObject,
  });

  console.log({ result });
  return result.modifiedCount > 0;
};

// Get existing records of person or company attributes

const getPersonAttributes = async (id: string) => {
  if (ObjectId.isValid(id)) {
    const personById = await prisma.person_attributes.findUnique({
      where: { id },
    });
    if (personById) return personById;
  }

  // If id is not a valid ObjectId, try querying by email
  const personByEmail = await prisma.person_attributes.findFirst({
    where: { email: id },
  });
  if (personByEmail) return personByEmail;

  // If still no result, try querying by linkedin_url
  const personByLinkedin = await prisma.person_attributes.findFirst({
    where: { linkedin_url: id },
  });

  return personByLinkedin; // either a person or null
};

const getCompanyAttributes = async (id: string, linkedIn?: string) => {
  // Find by ID if its ObjectId
  if (ObjectId.isValid(id)) {
    const companyById = await prisma.company_attributes.findUnique({
      where: { id },
    });
    if (companyById) return companyById;
  }

  // If id is not a valid ObjectId, try by domain
  const companyByDomain = await prisma.company_attributes.findFirst({
    where: { domain: id },
  });
  if (companyByDomain) return companyByDomain;

  // Finally, try to find by LinkedIn URL if provided
  if (linkedIn) {
    const companyByLinkedin_url = await prisma.company_attributes.findFirst({
      where: { linkedin_url: linkedIn },
    });
    if (companyByLinkedin_url) return companyByLinkedin_url;
  }

  // No match found
  return null;
};
// export const updatePersonAttributeHost = async (
//   id: string,
//   host: { hostId: string; hostName: string }
// ) => {
//   try {
//     const { id: user_id } = await getUserSettings({ id: true });

//     const baseId = splitFirstUnderscore(id);

//     // Get Existing data
//     const personAttribute = await getPersonAttributes(baseId);

//     if (personAttribute?.id) {
//       await prisma.person_attributes.update({
//         where: { id: personAttribute.id },
//         data: {
//           metadata: {
//             created_at: personAttribute.metadata?.created_at || new Date(),
//             bigquery_sync_status: 'pending',
//             updated_at: new Date(),
//           },
//           update_history: {
//             push: {
//               user_id,
//               host_id: host.hostId,
//               source: 'webapp',
//               webapp: true,
//               updated_at: new Date(),
//             },
//           },
//         },
//       });
//     } else {
//       const data: Record<string, any> = {
//         metadata: {
//           created_at: new Date(),
//           bigquery_sync_status: 'pending',
//           updated_at: new Date(),
//         },
//         update_history: [
//           {
//             user_id,
//             host_id: host.hostId,
//             source: 'webapp',
//             webapp: true,
//             updated_at: new Date(),
//           },
//         ],
//       };

//       if (baseId.includes('@')) {
//         data.email = baseId;
//       } else if (baseId.includes('linkedin')) {
//         data.linkedin_url = baseId;
//       }

//       await prisma.person_attributes.create({
//         data,
//       });
//     }

//     await updateLeadsMissingAttributesHost(id, { hostId: host.hostId, hostName: host.hostName });

//     revalidatePath(paths.attributesUpload.missing);
//     return { success: true };
//   } catch (error) {
//     console.error('Error on person attribute update:', error);

//     return {
//       success: false,
//       message: 'Failed to update person attribute. Please try again later.',
//     };
//   }
// };
