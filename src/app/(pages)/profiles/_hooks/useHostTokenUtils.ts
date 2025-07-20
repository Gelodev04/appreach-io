import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { generateLookerStudioUrl } from 'src/sections/host/utils';

export const useHostTokenUtils = () => {
  const { enqueueSnackbar } = useSnackbar();

  const extractValidTokens = (hosts: any[], warn = false): string[] => {
    const hostsWithoutToken = hosts.filter((h) => !h.token);

    if (warn && hostsWithoutToken.length > 0) {
      const names = hostsWithoutToken.map((h) => h.host).join(', ');
      enqueueSnackbar(`Some hosts have no token: ${names}`, { variant: 'warning' });
    }

    return hosts.map((h) => h.token?.access).filter((token): token is string => !!token);
  };

  const getSharableUrl = (tokens: string[]) =>
    `${window.location.origin}${paths.sharable.overview(tokens.join(','))}`;

  const getLookerUrl = async (tokens: string[]) => await generateLookerStudioUrl(tokens);

  return {
    extractValidTokens,
    getSharableUrl,
    getLookerUrl,
  };
};
