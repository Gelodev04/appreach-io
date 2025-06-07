export type CreateAttributeUploadsPropType = {
  host_id: {
    label: string;
    value: string;
  };

  name: string;
};
export interface PositiveLead {
  host_id: string;
  host_name: string;
  persons_array_id: string;
  person_updated_at?: Date;
  person_attributes_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  linkedin_url?: string;
  linkedin_company_url?: string;
  job_title?: string;
  reporting_location?: string;
}

export interface CompanyMissingAttributes {
  host_id: string;
  host_name: string;
  companies_array_id: string;
  company_updated_at: Date;
  company_attributes_id?: string;
  company_name?: string;
  industry?: string;
  employee_count?: number;
  company_domain?: string;
  company_linkedin_url?: string;
}

export type PersonAttributesPropType = {
  email?: string;
  first_name?: string;
  last_name?: string;
  linkedin_url?: string;
  linkedin_company_url?: string;
  reporting_location?: string;
  job_title?: string;
};

export type CompanyAttributesPropType = {
  company_domain?: string;
  company_linkedin_url?: string;
  company_name?: string;
  industry?: string;
  employee_count?: string;
};
