export const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) {
      return response.json().then((json) => {
        throw { message: json.error, status: response.status };
      });
    }
    return response.json();
  });

// ----------------------------------------------------------------------

export const endpoints = {
  lookerStudio: '/api/looker-studio',
  host: {
    list: '/api/host',
    details: (hostId: string) => `/api/host/details/?hostId=${hostId}`,
    addExistingHost: '/api/host/add-existing-host',
    create: '/api/host/create',
    edit: '/api/host/edit',
    delete: '/api/host/delete',
  },
};
