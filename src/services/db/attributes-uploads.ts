'use server';

import axios from 'axios';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import prisma from 'src/auth/lib/prisma/db-prisma';
import {
  COMPANY_ATTRIBUTE_KEYS,
  PERSON_ATTRIBUTE_KEYS,
  UI_TO_COMPANY_KEY_MAP,
} from 'src/constants';
import { env } from 'src/data/env/server';
import {
  CompanyRow,
  CreateAttributeUploadsPropType,
  EnrichedPositiveLead,
  PersonRow,
} from 'src/types/attribute-uploads';
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

export const getEnrichedPositiveLeads = async (): Promise<EnrichedPositiveLead[]> => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts || hosts.length === 0) {
      throw new Error('Unable to get hosts');
    }

    const client = await clientPromise;
    const db = client.db();

    const pipeline = [
      // 1. Match documents for the user's hosts that are positive leads
      {
        $match: {
          host_id: { $in: hosts },
          lead_status_sentiment: 'positive',
        },
      },
      // 2. Deconstruct the missing_attributes array to process each item individually
      {
        $unwind: '$missing_attributes',
      },
      // 3. Lookup for Person Attributes with fallback
      {
        $lookup: {
          from: 'person_attributes',
          let: {
            p_linkedin: '$missing_attributes.linkedin_url',
            p_email: '$missing_attributes.email',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    // Primary match: linkedin_url
                    {
                      $and: [
                        { $ne: ['$$p_linkedin', null] },
                        { $eq: ['$linkedin_url', '$$p_linkedin'] },
                      ],
                    },
                    // Fallback match: email
                    { $eq: ['$email', '$$p_email'] },
                  ],
                },
              },
            },
            // Prioritize the linkedin match over the email match
            {
              $addFields: {
                match_priority: {
                  $cond: [{ $eq: ['$linkedin_url', '$$p_linkedin'] }, 1, 2],
                },
              },
            },
            { $sort: { match_priority: 1 } },
            { $limit: 1 },
          ],
          as: 'person_details',
        },
      },
      // 4. Lookup for Company Attributes with fallback
      {
        $lookup: {
          from: 'company_attributes',
          let: {
            c_linkedin: '$missing_attributes.linkedin_company_url',
            c_fallback: '$missing_attributes.domain',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    // Primary match: linkedin_url
                    {
                      $and: [
                        { $ne: ['$$c_linkedin', null] },
                        { $eq: ['$linkedin_url', '$$c_linkedin'] },
                      ],
                    },
                    // Fallback match: domain
                    {
                      $and: [{ $ne: ['$$c_fallback', null] }, { $eq: ['$domain', '$$c_fallback'] }],
                    },
                  ],
                },
              },
            },
            // Prioritize the linkedin match over the domain match
            {
              $addFields: {
                match_priority: {
                  $cond: [{ $eq: ['$linkedin_url', '$$c_linkedin'] }, 1, 2],
                },
              },
            },
            { $sort: { match_priority: 1 } },
            { $limit: 1 },
          ],
          as: 'company_details',
        },
      },
      // 5. Flatten the lookup results into single objects for easier access
      {
        $addFields: {
          person: { $ifNull: [{ $arrayElemAt: ['$person_details', 0] }, {}] },
          company: { $ifNull: [{ $arrayElemAt: ['$company_details', 0] }, {}] },
        },
      },
      // 6. Reshape the document into the final desired format
      {
        $replaceRoot: {
          newRoot: {
            // Base Info
            host_id: { $toObjectId: '$host_id' },
            host_name: '$host_name',
            array_id: '$missing_attributes.array_id',

            // Person Info (coalesce enriched data with original)
            person_updated_at: { $toDate: '$person.metadata.updated_at' },
            email: {
              $ifNull: ['$person.email', '$missing_attributes.email'],
            },
            first_name: '$person.first_name',
            last_name: '$person.last_name',
            linkedin_url: {
              $ifNull: ['$person.linkedin_url', '$missing_attributes.linkedin_url'],
            },
            job_title: '$person.job_title',
            reporting_location: '$person.reporting_location',

            // Company Info (coalesce enriched data with original)
            company_updated_at: { $toDate: '$company.metadata.updated_at' },
            company_name: '$company.name',
            industry: '$company.industry',
            employee_count: '$company.employee_count',
            company_domain: {
              $ifNull: ['$missing_attributes.domain', '$company.domain'],
            },
            company_linkedin_url: {
              $ifNull: ['$missing_attributes.linkedin_company_url', '$company.linkedin_url'],
            },
          },
        },
      },
    ];

    const results = await db.collection('leads_missing_attributes').aggregate(pipeline).toArray();

    // Map BSON/DB types to plain JavaScript objects for the client
    const plainResults: EnrichedPositiveLead[] = results.map((item: any) => ({
      host_id: item.host_id?.toString?.(),
      host_name: item.host_name,
      array_id: item.array_id,
      person_updated_at: item.person_updated_at,
      email: item.email,
      first_name: item.first_name,
      last_name: item.last_name,
      linkedin_url: item.linkedin_url,
      job_title: item.job_title,
      reporting_location: item.reporting_location,
      company_name: item.company_name,
      industry: item.industry,
      employee_count: item.employee_count,
      company_domain: item.company_domain,
      company_linkedin_url: item.company_linkedin_url,
      company_updated_at: item.company_updated_at,
    }));

    return plainResults;
  } catch (error) {
    console.error('Error in getEnrichedPositiveLeads:', error);
    throw new Error('Failed to get enriched lead data');
  }
};

export const updateMissingAttributes = async ({
  personRow,
  companyRow,
  arrayId,
  changedFields,
}: {
  personRow: PersonRow;
  companyRow: CompanyRow;
  arrayId: string;
  changedFields: Record<string, any>;
}) => {
  try {
    const { id: user_id } = await getUserSettings({ id: true });
    const personWhere = getPersonWhere(personRow);
    const companyWhere = getCompanyWhere(companyRow);
    const changedKeys = Object.keys(changedFields);

    const hasPersonChanges = changedKeys.some((key) => PERSON_ATTRIBUTE_KEYS.includes(key));
    const hasCompanyChanges = changedKeys.some((uiKey) => {
      const companyKey = UI_TO_COMPANY_KEY_MAP[uiKey] || uiKey;
      return COMPANY_ATTRIBUTE_KEYS.includes(companyKey);
    });

    // --- Handle Person Attributes ---
    if (hasPersonChanges && personWhere) {
      const existingPerson = await prisma.person_attributes.findFirst({ where: personWhere });
      if (existingPerson) {
        console.log({ personRow });
        await prisma.person_attributes.update({
          where: { id: existingPerson.id },
          data: {
            ...personRow,
            metadata: {
              created_at: existingPerson.metadata?.created_at || new Date(),
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
      } else {
        await prisma.person_attributes.create({
          data: {
            ...personRow,
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
      }
    }

    // --- Handle Company Attributes ---
    if (hasCompanyChanges && companyWhere) {
      const existingCompany = await prisma.company_attributes.findFirst({ where: companyWhere });
      if (existingCompany) {
        await prisma.company_attributes.update({
          where: { id: existingCompany.id },
          data: {
            ...companyRow,
            metadata: {
              created_at: existingCompany.metadata?.created_at || new Date(),
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
      } else {
        await prisma.company_attributes.create({
          data: {
            ...companyRow,
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
      }
    }

    if (arrayId) {
      await updateLeadsMissingAttributes({
        arrayId,
        update: {
          email: personRow.email,
          linkedin_url: personRow.linkedin_url,
          domain: companyRow.domain,
          linkedin_company_url: companyRow.linkedin_url,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Save failed:', error);
    return { success: false, message: 'An error occurred during save.' };
  }
};

export const updateLeadsMissingAttributes = async ({
  arrayId,
  update,
}: {
  arrayId: string;
  update: {
    email?: string;
    linkedin_url?: string;
    domain?: string;
    linkedin_company_url?: string;
  };
}) => {
  if (!arrayId) return;
  const client = await clientPromise;
  const db = client.db();

  await db.collection('leads_missing_attributes').updateOne(
    { 'missing_attributes.array_id': arrayId },
    {
      $set: {
        'missing_attributes.$.email': update.email,
        'missing_attributes.$.linkedin_url': update.linkedin_url,
        'missing_attributes.$.domain': update.domain,
        'missing_attributes.$.linkedin_company_url': update.linkedin_company_url,
      },
    }
  );
};

const getPersonWhere = (input: { linkedin_url?: string; email?: string }) => {
  if (input.linkedin_url) {
    return { linkedin_url: input.linkedin_url };
  } else if (input.email) {
    return { email: input.email };
  } else {
    return null;
  }
};

const getCompanyWhere = (input: { linkedin_url?: string; domain?: string }) => {
  if (input.linkedin_url) {
    return { linkedin_url: input.linkedin_url };
  } else if (input.domain) {
    return { domain: input.domain };
  } else {
    return null;
  }
};
