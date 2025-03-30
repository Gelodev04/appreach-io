import { GridColDef } from '@mui/x-data-grid';
import { DeleteSenderAccount } from 'src/app/(pages)/senders/non-api-linkedins/_components/delete-sender-account';
import { HostDropdown } from 'src/components/dropdown-select/host-dropdown';
import { updateSenderAccountHost } from 'src/services/db/sender-accounts';

type OptionType = {
  profile: string;
  id: string;
}[];

export const useNonApiLinkedinsCol = (options: OptionType) => {
  const columns: GridColDef[] = [
    {
      field: 'sender',
      headerName: 'Linkedin URL',
      flex: 1,
    },
    {
      field: 'sender_label',
      headerName: 'Label',
      flex: 1,
    },
    {
      field: 'host_id',
      headerName: 'Assigned Profile',
      renderCell: (params) => {
        return (
          <HostDropdown params={params} options={options} onUpdate={updateSenderAccountHost} />
        );
      },
      flex: 1,
      minWidth: 150,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return <DeleteSenderAccount id={params?.row?.id} username={params?.row?.sender_label} />;
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
  ];

  return { columns };
};
