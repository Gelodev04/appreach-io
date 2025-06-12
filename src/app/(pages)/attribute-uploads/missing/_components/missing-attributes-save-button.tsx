import { IconButton, Tooltip } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import Iconify from 'src/components/iconify';
import { updateMissingAttributes } from 'src/services/db/attributes-uploads';
import { useMissingAttributesFieldStore } from 'src/store/attribute-uploads';

type RowSaveButtonProps = {
  rowId: string;
  params: GridCellParams;
};
const personRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9%-]+\/?$/;

const companyRegex =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/(company|school)\/[a-zA-Z0-9.'&()%_%-]+(?:%[0-9A-Fa-f]{2})*\/?$/;

const emailRegex = /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/;

const formatLinkedinUrl = (url: string, fallbackType: 'in' | 'company'): string | undefined => {
  if (!url) return undefined;

  const cleanUrl = url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .trim();

  const match = cleanUrl.match(/^linkedin\.com\/(in|company|school)\/(.+)$/i);
  const type = match ? match[1] : fallbackType;
  const handle = match ? match[2] : cleanUrl;

  return `linkedin.com/${type}/${handle}`;
};

export const MissingAttributesSaveButton = ({ rowId, params }: RowSaveButtonProps) => {
  const { unsaved, clearRowChanges, updateSavedValues, editedValues } =
    useMissingAttributesFieldStore();
  const changes = unsaved[rowId];
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setTimeout(() => {
      if (disabled) return;
      startTransition(async () => {
        const getValue = (field: string) => {
          if (changes && changes[field] !== undefined) {
            return changes[field];
          }
          if (editedValues[rowId] && editedValues[rowId][field] !== undefined) {
            return editedValues[rowId][field];
          }
          return params.row[field];
        };

        const rawPersonLinkedin = getValue('linkedin_url');
        const rawCompanyLinkedin = getValue('company_linkedin_url');
        const rawEmail = getValue('email')?.toLowerCase();
        const currentChanges = { ...(unsaved[rowId] || {}) };

        // Validate email
        if (rawEmail && !emailRegex.test(rawEmail)) {
          enqueueSnackbar('Invalid email format.', { variant: 'error', persist: true });
          return;
        }

        // Validate LinkedIn URLs
        if (rawPersonLinkedin && !personRegex.test(rawPersonLinkedin)) {
          enqueueSnackbar('Invalid LinkedIn Person Standard URL format.', {
            variant: 'error',
            persist: true,
          });
          return;
        }

        if (rawCompanyLinkedin && !companyRegex.test(rawCompanyLinkedin)) {
          console.log({ rawCompanyLinkedin });
          enqueueSnackbar('Invalid Company LinkedIn URL format.', {
            variant: 'error',
            persist: true,
          });
          return;
        }
        const personRow = {
          email: rawEmail || undefined,
          linkedin_url: rawPersonLinkedin ? formatLinkedinUrl(rawPersonLinkedin, 'in') : undefined,
          first_name: getValue('first_name'),
          last_name: getValue('last_name'),
          job_title: getValue('job_title')?.toLowerCase(),
          reporting_location: getValue('reporting_location')?.toLowerCase(),
          domain: getValue('company_domain')?.toLowerCase(),
          linkedin_company_url: rawCompanyLinkedin
            ? formatLinkedinUrl(rawCompanyLinkedin, 'company')
            : undefined,
          company_name: getValue('company_name'),
        };

        // Safely get and convert employee_count
        const employeeCountValue = getValue('employee_count');
        const finalEmployeeCount =
          employeeCountValue != null && !Number.isNaN(Number(employeeCountValue))
            ? Number(employeeCountValue)
            : undefined;

        const companyRow = {
          domain: getValue('company_domain')?.toLowerCase(),
          linkedin_url: rawCompanyLinkedin
            ? formatLinkedinUrl(rawCompanyLinkedin, 'company')
            : undefined,
          name: getValue('company_name'),
          industry: getValue('industry')?.toLowerCase(),
          employee_count: finalEmployeeCount,
        };

        try {
          const response = await updateMissingAttributes({
            personRow,
            companyRow,
            arrayId: rowId,
            changedFields: currentChanges,
          });
          if (response.success) {
            enqueueSnackbar('Attribute updated successfully!', { variant: 'success' });
            // Update savedValues
            updateSavedValues(rowId, currentChanges);
            // Clear unsaved
            clearRowChanges(rowId);
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
    }, 0);
  };

  const hasChanges = changes && Object.keys(changes).length > 0;
  const disabled = isPending || !hasChanges;
  const handleMouseDown = (event: React.MouseEvent) => {
    // Prevent the grid from taking focus and cancelling the edit
    // before the onClick has a chance to fire
    event.preventDefault();
  };
  return (
    <Tooltip title="Save changes">
      <IconButton
        component="span"
        onClick={handleSave}
        onMouseDown={handleMouseDown}
        disabled={disabled}
      >
        <Iconify icon="material-symbols:save-outline-rounded" />
      </IconButton>
    </Tooltip>
  );
};
