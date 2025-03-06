'use server';

import { env } from 'src/data/env/server';

export async function getHubspotAuthUrl() {
  const clientId = env.HUBSPOT_CLIENT_ID;
  const redirectUri = env.HUBSPOT_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Missing OAuth credentials');
  }

  const requiredScopes = ['crm.objects.contacts.read', 'crm.objects.deals.read'];
  const optionalScopes = [
    'communication_preferences.read',
    'crm.objects.marketing_events.read',
    'marketing.campaigns.read',
  ];

  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${requiredScopes.join('%20')}&optional_scope=${optionalScopes.join('%20')}`;

  return authUrl;
}
