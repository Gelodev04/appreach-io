import { Box, Button, Typography } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { useState } from 'react';

export const LeadStatusMessage = ({ params }: { params: GridCellParams }) => {
  const msg = params?.row?.content?.body || '';
  const previewLimit = 100;

  const [expanded, setExpanded] = useState(false);
  const isLong = msg.length > previewLimit;

  const previewText = isLong && !expanded ? msg.substring(0, previewLimit) + '...' : msg;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        wordBreak: 'break-word',
        width: '100%',
      }}
    >
      <Typography sx={{ whiteSpace: 'pre-line' }}>{previewText}</Typography>
      {isLong && (
        <Button
          sx={{ padding: 0, minWidth: 'auto', textTransform: 'none' }}
          size="small"
          variant="text"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </Box>
  );
};
