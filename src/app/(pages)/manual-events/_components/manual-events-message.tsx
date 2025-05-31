import { Box, Button, Link, Typography } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { useState } from 'react';

export const ManualEventsMessage = ({ params }: { params: GridCellParams }) => {
  const rawMsg: string = params?.row?.content?.body_preview || '';
  const viewUrl: string | undefined = params.row?.content?.view_url;
  const previewLimit = 100;

  const [expanded, setExpanded] = useState(false);
  const isLong = rawMsg.length > previewLimit;

  const previewText =
    rawMsg && isLong && !expanded ? `${rawMsg.substring(0, previewLimit)}...` : rawMsg;

  const hasPreview = Boolean(previewText);
  const hasView = Boolean(viewUrl);

  if (!hasPreview && !hasView) {
    return null;
  }

  let content;
  if (hasPreview) {
    content = hasView ? (
      <Link
        href={viewUrl}
        target="_blank"
        underline="none"
        sx={{
          cursor: 'pointer',
          width: '100%',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <Typography sx={{ whiteSpace: 'pre-line' }}>{previewText}</Typography>
      </Link>
    ) : (
      <Typography sx={{ whiteSpace: 'pre-line' }}>{previewText}</Typography>
    );
  } else {
    content = (
      <Link
        href={viewUrl}
        target="_blank"
        variant="subtitle2"
        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
      >
        View Url
      </Link>
    );
  }

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
      {content}

      {hasPreview && isLong && (
        <Button
          sx={{ padding: 1, minWidth: 'auto', textTransform: 'none' }}
          size="small"
          variant="text"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </Box>
  );
};
