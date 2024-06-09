import { mutate } from 'swr';

export const revalidateData = async (url:string) => {
  await mutate(url);
};

// ----------------------------------------------------------------------

export const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) {
      return response.json().then((json) => {
        throw new Error(json.error)
      });
    }
    return response.json();
  });

// ----------------------------------------------------------------------

export const endpoints = {
  lookerStudio: '/api/looker-studio',
  host: {
    list: '/api/host/list',
    details: (hostId: string) => `/api/host/details/?hostId=${hostId}`,
    addExistingHost: '/api/host/add-existing-host',
    create: '/api/host/create',
    edit: '/api/host/edit',
    delete: '/api/host/delete',
  },
  seed: {
    list: '/api/seed/list',
    create: '/api/seed/create',
    settings: '/api/seed/settings',
    delete: '/api/seed/delete',
  },
  csvUpload: {
    list: '/api/csv-upload/list',
    create: '/api/csv-upload/create',
  },
};
