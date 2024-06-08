import { useDropzone } from 'react-dropzone';

import { alpha, styled } from '@mui/material/styles';
// @mui
import { Box, Stack, Typography, StackProps } from '@mui/material';

import { UploadIllustration } from 'src/assets/illustrations';

//
//
import { UploadDocumentProps } from './types';
import RejectionFiles from './errors-rejection-files';
import SingleDocumentPreview from './preview-single-document';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  '&:hover': {
    opacity: 0.72,
  },
}));

// ----------------------------------------------------------------------

export default function UploadDocument({
  disabled,
  error,
  helperText,
  //
  file,
  onDelete,
  sx,
  ...other
}: UploadDocumentProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    disabled,
    ...other,
  });

  const hasFile = !!file;

  const isError = isDragReject || !!error;

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      {!hasFile && (
        <StyledDropZone
          {...getRootProps()}
          sx={{
            ...(isDragActive && {
              opacity: 0.72,
            }),
            ...(isError && {
              color: 'error.main',
              bgcolor: 'error.lighter',
              borderColor: 'error.light',
            }),
            ...(disabled && {
              opacity: 0.48,
              pointerEvents: 'none',
            }),
          }}
        >
          <input {...getInputProps()} />

          <Placeholder />
        </StyledDropZone>
      )}

      <SingleDocumentPreview file={file} onDelete={onDelete} />

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />
    </Box>
  );
}

// ----------------------------------------------------------------------

function Placeholder({ sx, ...other }: StackProps) {
  return (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        ...sx,
      }}
      {...other}
    >
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />

      <div>
        <Typography gutterBottom variant="h5">
          Drop or select a file
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Drop a file here or click
          <Typography
            variant="body2"
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            browse
          </Typography>
          thorough your machine
        </Typography>
      </div>
    </Stack>
  );
}
