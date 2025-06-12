import { GridColDef } from '@mui/x-data-grid';

import { Typography } from '@mui/material';
import { fDateTime } from 'src/utils/format-time';
import { MissingAttributesSaveButton } from '../_components/missing-attributes-save-button';
import { MissingAttributesTextbox } from '../_components/missing-attributes-textbox';

export const useMissingAttributesCol = () => {
  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Email',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },

    {
      field: 'linkedin_url',
      headerName: 'LinkedIn Person Standard Url',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'first_name',
      headerName: 'Person First Name',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'last_name',
      headerName: 'Person Last Name',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'job_title',
      headerName: 'Person Job Title',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },

    {
      field: 'reporting_location',
      headerName: 'Person Reporting Location',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'person_updated_at',
      headerName: 'Person Last Updated',
      sortable: true,
      valueGetter: (params) => params.row?.person_updated_at,
      renderCell: (params) => (
        <Typography sx={{ my: 2 }}>{fDateTime(params.row?.person_updated_at)}</Typography>
      ),
      type: 'date',
      flex: 1,
      minWidth: 250,
    },

    {
      field: 'company_domain',
      headerName: 'Company Domain',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'company_linkedin_url',
      headerName: 'LinkedIn Company Url',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'company_name',
      headerName: 'Company Name',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'industry',
      headerName: 'Company Industry',
      renderCell: (params) => <MissingAttributesTextbox params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'employee_count',
      headerName: 'Company Employee Count',
      renderCell: (params) => <MissingAttributesTextbox params={params} type="number" />,
      flex: 1,
      minWidth: 250,
    },

    {
      field: 'company_updated_at',
      headerName: 'Company Last Updated',
      sortable: true,
      valueGetter: (params) => params.row?.company_updated_at,
      renderCell: (params) => (
        <Typography sx={{ my: 2 }}>{fDateTime(params.row?.company_updated_at)}</Typography>
      ),
      type: 'date',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <MissingAttributesSaveButton rowId={params.row.id} params={params} />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      minWidth: 100,
      cellClassName: 'sticky-cell-save',
      headerClassName: 'sticky-header-save',
    },

    {
      field: 'host_name',
      headerName: 'Profile',
      valueGetter: (params) => params.row.host_name,
      renderCell: (params) => params.row.host_name,
      flex: 1,
      minWidth: 250,
      hideable: false,
    },
  ];

  return { columns };
};
