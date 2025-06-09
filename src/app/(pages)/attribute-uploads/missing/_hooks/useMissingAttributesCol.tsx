import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { Typography } from '@mui/material';
import { fDateTime } from 'src/utils/format-time';
import { MissingAttributesSaveButton } from '../_components/missing-attributes-save-button';
import { MissingAttributesTextbox } from '../_components/missing-attributes-textbox';

export const useMissingAttributesCol = (attributeType: 'person' | 'company') => {
  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: Record<string, GridColDef> = {
      email: {
        field: 'email',
        headerName: 'Email',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      domain: {
        field: 'company_domain',
        headerName: 'Domain',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      company_linked_in_url: {
        field: 'company_linkedin_url',
        headerName: 'LinkedIn Company Url',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      company_name: {
        field: 'company_name',
        headerName: 'Name',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      industry: {
        field: 'industry',
        headerName: 'Industry',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      employee_count: {
        field: 'employee_count',
        headerName: 'Employee Count',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} type="number" />
        ),
        flex: 1,
        minWidth: 250,
      },
      linkedin_url: {
        field: 'linkedin_url',
        headerName: 'LinkedIn Public Url',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      linkedin_company_url: {
        field: 'linkedin_company_url',
        headerName: 'LinkedIn Company Url',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      first_name: {
        field: 'first_name',
        headerName: 'First Name',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      last_name: {
        field: 'last_name',
        headerName: 'Last Name',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      job_title: {
        field: 'job_title',
        headerName: 'Job Title',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      reporting_location: {
        field: 'reporting_location',
        headerName: 'Reporting Location',
        renderCell: (params) => (
          <MissingAttributesTextbox params={params} attributeType={attributeType} />
        ),
        flex: 1,
        minWidth: 250,
      },
      host_name: {
        field: 'host_name',
        headerName: 'Profile',
        valueGetter: (params) => params.row.host_name,
        renderCell: (params) => params.row.host_name,
        flex: 1,
        minWidth: 250,
        hideable: false,
      },
      person_updated_at: {
        field: 'person_updated_at',
        headerName: 'Last Synced',
        sortable: true,
        valueGetter: (params) => params.row?.person_updated_at,
        renderCell: (params) => (
          <Typography sx={{ my: 2 }}>{fDateTime(params.row?.person_updated_at)}</Typography>
        ),
        type: 'date',
        flex: 1,
        minWidth: 200,
      },
      company_updated_at: {
        field: 'company_updated_at',
        headerName: 'Last Synced',
        sortable: true,
        valueGetter: (params) => params.row?.company_updated_at,
        renderCell: (params) => (
          <Typography sx={{ my: 2 }}>{fDateTime(params.row?.company_updated_at)}</Typography>
        ),
        type: 'date',
        flex: 1,
        minWidth: 200,
      },
      actions: {
        field: 'actions',
        headerName: 'Actions',
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <MissingAttributesSaveButton
            rowId={params.row.id}
            params={params}
            attributeType={attributeType}
          />
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
        flex: 1,
        minWidth: 100,
        cellClassName: 'sticky-cell-save',
        headerClassName: 'sticky-header-save',
      },
    };

    const columnOrderMap: Record<typeof attributeType, string[]> = {
      person: [
        'email',
        'linkedin_url',
        'linkedin_company_url',
        'first_name',
        'last_name',
        'job_title',
        'reporting_location',
        // 'host_id',
        'person_updated_at',
        'actions',
        'host_name',
      ],
      company: [
        'domain',
        'company_linked_in_url',
        'company_name',
        'industry',
        'employee_count',
        'company_updated_at',
        'actions',
        'host_name',
      ],
    };

    return columnOrderMap[attributeType].map((key) => baseColumns[key]);
  }, [attributeType]);

  return { columns };
};
