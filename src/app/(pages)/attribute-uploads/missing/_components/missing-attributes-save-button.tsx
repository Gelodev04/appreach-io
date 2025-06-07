import { IconButton, Tooltip } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import Iconify from 'src/components/iconify';
import {
  updateCompanyMissingAttributes,
  updatePersonMissingAttributes,
} from 'src/services/db/attributes-uploads';
import { useMissingAttributesStore } from '../_hooks/useMissingAttributesStore';

type RowSaveButtonProps = {
  rowId: string;
  params: GridCellParams;
  attributeType: 'person' | 'company';
};

const formatLinkedinUrl = (url: string, type: 'in' | 'company') => {
  if (!url) return undefined;

  const cleanUrl = url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .trim();

  const match = cleanUrl.match(/^linkedin\.com\/(?:in|company)\/(.+)$/i);
  const handle = match ? match[1] : cleanUrl;

  return `linkedin.com/${type}/${handle}`;
};

export const MissingAttributesSaveButton = ({
  rowId,
  params,
  attributeType,
}: RowSaveButtonProps) => {
  const { unsaved, clearFieldChange, updateSavedValues } = useMissingAttributesStore(attributeType);
  const changes = unsaved[rowId];
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const personRow = {
        email: (changes?.email ?? params.row.email)?.toLowerCase(),
        first_name: changes?.first_name ?? params.row.first_name,
        last_name: changes?.last_name ?? params.row.last_name,
        linkedin_url: formatLinkedinUrl(changes?.linkedin_url ?? params.row.linkedin_url, 'in'),
        linkedin_company_url: formatLinkedinUrl(
          changes?.linkedin_company_url ?? params.row.linkedin_company_url,
          'company'
        ),
        job_title: (changes?.job_title ?? params.row.job_title)?.toLowerCase(),
        domain: (changes?.email ?? params.row.email)?.split('@')[1],
        reporting_location: (
          changes?.reporting_location ?? params.row.reporting_location
        )?.toLowerCase(),
      };
      const companyRow = {
        company_domain: (changes?.company_domain ?? params.row.company_domain)?.toLowerCase(),
        company_linkedin_url: formatLinkedinUrl(
          changes?.company_linkedin_url ?? params.row.company_linkedin_url,
          'company'
        ),
        company_name: changes?.company_name ?? params.row.company_name,
        industry: (changes?.industry ?? params.row.industry)?.toLowerCase(),
        employee_count: changes?.employee_count ?? params.row.employee_count,
      };

      try {
        let response;
        if (attributeType === 'person') {
          response = await updatePersonMissingAttributes(rowId, personRow);
        } else {
          response = await updateCompanyMissingAttributes(rowId, companyRow);
        }

        if (response.success) {
          enqueueSnackbar('Attribute updated successfully!', { variant: 'success' });
          // Update savedValues
          updateSavedValues(rowId, changes);

          // Clear unsaved
          Object.keys(changes).forEach((field) => clearFieldChange(rowId, field));
        } else {
          enqueueSnackbar(response.message || 'Failed to save', {
            variant: 'error',
            persist: true,
          });
        }
      } catch (error) {
        enqueueSnackbar('Failed to save due to an error.', { variant: 'error', persist: true });
      }
    });
  };

  const disabled = isPending || !changes;

  return (
    <Tooltip title={disabled ? '' : 'Save changes'}>
      <IconButton component="span" onClick={disabled ? undefined : handleSave} disabled={disabled}>
        <Iconify icon="material-symbols:save-outline-rounded" />
      </IconButton>
    </Tooltip>
  );
};
