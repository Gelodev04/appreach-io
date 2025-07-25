import { Typography } from '@mui/material';
import Label from 'src/components/label';

export const RenderCellStatus = ({ status }: { status: string }) => {
  return (
    <Label variant="soft" color={(status === 'success' && 'success') || 'error'}>
      {status}
    </Label>
  );
};

export const RenderCellText = ({
  displayValue,
  multiline = true,
}: {
  displayValue: string;
  multiline?: boolean;
}) => {
  return (
    <div title={displayValue} style={{ overflow: 'hidden' }}>
      <Typography
        sx={{
          overflow: 'hidden',
          ...(multiline
            ? {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.4,
              }
            : {
                textOverflow: 'ellipsis',
                textWrap: 'nowrap',
              }),
          my: 2,
        }}
      >
        {displayValue}
      </Typography>
    </div>
  );
};
