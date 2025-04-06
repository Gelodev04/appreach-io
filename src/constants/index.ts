export const defaultEngagementSettings = {
  key: 'defaultEngagementSettings',
  engagementSettings: {
    scrollMessage: 100,
    markImportant: 100,
    removeSpam: 100,
    movePrimary: 100,
    clickLink: 100,
    linksToClick: [],
    linksNotToClick: [],
    filterId: null,
    disableFilterId: false,
    replyMessage: 100,
    replyPrompt:
      'Write an engaging reply, express interest, show appreciation, and ask a thoughtful follow-up question. Don’t always use the most natural words and provide personal examples.',
  },
};

export const espData = {
  'google business': {
    esp: 'google business',
    espCamelCase: 'googleBusiness',
    server: 'google',
  },
  'microsoft business': {
    esp: 'microsoft business',
    espCamelCase: 'microsoftBusiness',
    server: 'microsoft',
  },
  'google personal': {
    esp: 'google personal',
    espCamelCase: 'googlePersonal',
    server: 'google',
  },
  'microsoft personal': {
    esp: 'microsoft personal',
    espCamelCase: 'microsoftPersonal',
    server: 'microsoft',
  },
};

export const sourceOptions = [
  { label: 'GrowMeOrganic LinkedIn', value: 'growmeorganic_linkedin' },
  { label: 'Apollo Default', value: 'apollo' },
  { label: 'Apollo Apify', value: 'apollo_apify' },
  { label: 'Apollo Enriched', value: 'apollo_enriched' },
];

export const columnOptions = [
  {
    label: 'First Name',
    value: '{{person}}.first_name',
  },
  {
    label: 'Last Name',
    value: '{{person}}.last_name',
  },
  {
    label: 'Title',
    value: '{{person}}.linkedin_job_title',
  },
  {
    label: 'Primary Email',
    value: '{{person}}.email',
  },
  {
    label: 'Person Phone',
    value: '{{person}}.phone',
  },
  {
    label: 'Person City',
    value: '{{person}}.city',
  },
  {
    label: 'Person State',
    value: '{{person}}.state',
  },
  {
    label: 'Person Country',
    value: '{{person}}.country',
  },
  {
    label: 'Company Name',
    value: '{{company}}.company',
  },
  {
    label: 'Pretty Company Name',
    value: '{{company}}.pretty_company_name',
  },
  {
    label: 'Employees',
    value: '{{company}}.employee_count',
  },
  {
    label: 'Industry',
    value: '{{company}}.industry',
  },
  {
    label: 'Keywords',
    value: '{{company}}.keywords',
  },
  {
    label: 'Person Linkedin Url',
    value: '{{person}}.linkedin_url',
  },
  {
    label: 'Website',
    value: '{{company}}.website',
  },
  {
    label: 'Company Linkedin Url',
    value: '{{company}}.linkedin_url',
  },
  {
    label: 'Facebook Url',
    value: '{{company}}.facebook_url',
  },
  {
    label: 'Twitter Url',
    value: '{{company}}.x_url',
  },
  {
    label: 'Company Address',
    value: '{{company}}.address',
  },
  {
    label: 'Company Phone',
    value: '{{company}}.phone',
  },
  {
    label: 'Company Description',
    value: '{{company}}.description',
  },
  {
    label: 'Annual Revenue',
    value: '{{company}}.annual_revenue',
  },
  {
    label: 'Total Funding',
    value: '{{company}}.total_funding',
  },
  {
    label: 'Latest Funding',
    value: '{{company}}.latest_funding',
  },
  {
    label: 'Last Raised At',
    value: '{{company}}.last_raised_at',
  },
  {
    label: 'Personal Emails [0]',
    value: '{{person}}.personal_emails.[0]',
  },
  {
    label: 'Personal Emails [1]',
    value: '{{person}}.personal_emails.[1]',
  },
  {
    label: 'Personal Emails [2]',
    value: '{{person}}.personal_emails.[2]',
  },
  {
    label: 'Personal Emails [3]',
    value: '{{person}}.personal_emails.[3]',
  },
  {
    label: 'Personal Emails [4]',
    value: '{{person}}.personal_emails.[4]',
  },
  {
    label: 'Personal Emails [5]',
    value: '{{person}}.personal_emails.[5]',
  },
  {
    label: 'Personal Emails [6]',
    value: '{{person}}.personal_emails.[6]',
  },
  {
    label: 'Personal Emails [7]',
    value: '{{person}}.personal_emails.[7]',
  },
  {
    label: 'customer Id',
    value: '{{custom}}.customer_id',
  },
  {
    label: 'Lifetime Value',
    value: '{{custom}}.lifetime_value',
  },
];

export const headerMapping = {
  'first name': '{{person}}.first_name',
  'last name': '{{person}}.last_name',
  title: '{{person}}.linkedin_job_title',
  job: '{{person}}.linkedin_job_title',
  position: '{{person}}.linkedin_job_title',
  email: '{{person}}.email',
  'email address': '{{person}}.email',
  'first phone': '{{person}}.phone',
  phone: '{{person}}.phone',
  city: '{{person}}.city',
  state: '{{person}}.state',
  country: '{{person}}.country',
  company: '{{company}}.name',
  'company name': '{{company}}.company',
  'organization name': '{{company}}.company',
  'company name for emails': '{{company}}.pretty_company_name',
  employees: '{{company}}.employee_count',
  'estimated num employees': '{{company}}.employee_count',
  industry: '{{company}}.industry',
  keywords: '{{company}}.keywords',
  'person linkedin url': '{{person}}.linkedin_url',
  website: '{{company}}.website',
  'organization website url': '{{company}}.website',
  'company linkedin url': '{{company}}.linkedin_url',
  'organization linkedin url': '{{company}}.linkedin_url',
  'facebook url': '{{company}}.facebook_url',
  'twitter url': '{{company}}.x_url',
  'company address': '{{company}}.address',
  'company phone': '{{company}}.phone',
  'seo description': '{{company}}.description',
  'annual revenue': '{{company}}.annual_revenue',
  'total funding': '{{company}}.total_funding',
  'latest funding': '{{company}}.latest_funding',
  'last raised at': '{{company}}.last_raised_at',
  'personal emails0': '{{person}}.personal_emails.[0]',
  'personal emails1': '{{person}}.personal_emails.[1]',
  'personal emails2': '{{person}}.personal_emails.[2]',
  'personal emails3': '{{person}}.personal_emails.[3]',
  'personal emails4': '{{person}}.personal_emails.[4]',
  'personal emails5': '{{person}}.personal_emails.[5]',
  'personal emails6': '{{person}}.personal_emails.[6]',
  'personal emails7': '{{person}}.personal_emails.[7]',
};
