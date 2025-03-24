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
    value: '{{person}}.firstName',
  },
  {
    label: 'Last Name',
    value: '{{person}}.lastName',
  },
  {
    label: 'Title',
    value: '{{person}}.title',
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
    value: '{{company}}.name',
  },
  {
    label: 'Pretty Company Name',
    value: '{{company}}.prettyCompanyName',
  },
  {
    label: 'Employees',
    value: '{{company}}.employeeCount',
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
    value: '{{person}}.linkedinUrl',
  },
  {
    label: 'Website',
    value: '{{company}}.website',
  },
  {
    label: 'Company Linkedin Url',
    value: '{{company}}.linkedinUrl',
  },
  {
    label: 'Facebook Url',
    value: '{{company}}.facebookUrl',
  },
  {
    label: 'Twitter Url',
    value: '{{company}}.twitterUrl',
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
    value: '{{company}}.annualRevenue',
  },
  {
    label: 'Total Funding',
    value: '{{company}}.totalFunding',
  },
  {
    label: 'Latest Funding',
    value: '{{company}}.latestFunding',
  },
  {
    label: 'Last Raised At',
    value: '{{company}}.lastRaisedAt',
  },
  {
    label: 'personal_emails/0',
    value: '{{person}}.personalEmails.[0]',
  },
  {
    label: 'personal_emails/1',
    value: '{{person}}.personalEmails.[1]',
  },
  {
    label: 'personal_emails/2',
    value: '{{person}}.personalEmails.[2]',
  },
  {
    label: 'personal_emails/3',
    value: '{{person}}.personalEmails.[3]',
  },
  {
    label: 'personal_emails/4',
    value: '{{person}}.personalEmails.[4]',
  },
  {
    label: 'personal_emails/5',
    value: '{{person}}.personalEmails.[5]',
  },
  {
    label: 'personal_emails/6',
    value: '{{person}}.personalEmails.[6]',
  },
  {
    label: 'personal_emails/7',
    value: '{{person}}.personalEmails.[7]',
  },
];

export const headerMapping = {
  'first name': '{{person}}.firstName',
  'last name': '{{person}}.lastName',
  title: '{{person}}.title',
  job: '{{person}}.title',
  position: '{{person}}.title',
  email: '{{person}}.email',
  'email address': '{{person}}.email',
  'first phone': '{{person}}.phone',
  phone: '{{person}}.phone',
  city: '{{person}}.city',
  state: '{{person}}.state',
  country: '{{person}}.country',
  company: '{{company}}.name',
  'company name': '{{company}}.name',
  'organization name': '{{company}}.name',
  'company name for emails': '{{company}}.prettyCompanyName',
  employees: '{{company}}.employeeCount',
  'estimated num employees': '{{company}}.employeeCount',
  industry: '{{company}}.industry',
  keywords: '{{company}}.keywords',
  'person linkedin url': '{{person}}.linkedinUrl',
  website: '{{company}}.website',
  'organization website url': '{{company}}.website',
  'company linkedin url': '{{company}}.linkedinUrl',
  'organization linkedin url': '{{company}}.linkedinUrl',
  'facebook url': '{{company}}.facebookUrl',
  'twitter url': '{{company}}.twitterUrl',
  'company address': '{{company}}.address',
  'company phone': '{{company}}.phone',
  'seo description': '{{company}}.description',
  'annual revenue': '{{company}}.annualRevenue',
  'total funding': '{{company}}.totalFunding',
  'latest funding': '{{company}}.latestFunding',
  'last raised at': '{{company}}.lastRaisedAt',
};

export const normalizeHeader = (header: string) => {
  return header
    .replace(/_/g, ' ') // Replace underscores with spaces first
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters like {{ }}
    .trim()
    .toLowerCase();
};
