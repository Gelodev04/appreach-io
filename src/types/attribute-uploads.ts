export type CreateAttributeUploadsPropType = {
  host_id: {
    label: string;
    value: string;
  };

  name: string;
};

export interface EnrichedPositiveLead {
  host_id: string;
  host_name: string;
  array_id: string;

  // Person Attributes
  person_attributes_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  linkedin_url?: string;
  job_title?: string;
  reporting_location?: string;
  person_updated_at: Date;

  // Company Attributes
  company_attributes_id?: string;
  company_name?: string;
  industry?: string;
  employee_count?: number;
  company_domain?: string;
  company_linkedin_url?: string;
  company_updated_at: Date;
}

export type PersonRow = {
  email?: string;
  linkedin_url?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  reporting_location?: string;
  domain?: string;
  linkedin_company_url?: string;
  company_name?: string;
};

export type CompanyRow = {
  domain?: string;
  linkedin_url?: string;
  name?: string;
  industry?: string;
  employee_count?: number;
};
