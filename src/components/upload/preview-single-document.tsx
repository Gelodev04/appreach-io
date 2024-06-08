import { m, AnimatePresence } from 'framer-motion';

// @mui
import { alpha } from '@mui/material/styles';
import { Stack, IconButton, Typography } from '@mui/material';

// utils
import { fData } from 'src/utils/format-number';

import { varFade } from '../animate';
//
import Iconify from '../iconify/iconify';
import { fileData } from '../file-thumbnail';
//
import { UploadDocumentProps } from './types';
import FileThumbnail from '../file-thumbnail/file-thumbnail';

// ----------------------------------------------------------------------

export default function SingleDocumentPreview({
  thumbnail,
  file,
  onDelete,
  sx,
}: UploadDocumentProps) {
  if (!file) {
    return null;
  }

  const { key, name = '', size = 0 } = fileData(file);

  const isNotFormatFile = typeof file === 'string';

  if (thumbnail) {
    return (
      <AnimatePresence initial={false}>
        <Stack
          key={key}
          component={m.div}
          {...varFade().inUp}
          alignItems="center"
          display="inline-flex"
          justifyContent="center"
          sx={{
            m: 0.5,
            width: 80,
            height: 80,
            borderRadius: 1.25,
            overflow: 'hidden',
            position: 'relative',
            border: (theme) => `solid 1px ${theme.palette.divider}`,
            ...sx,
          }}
        >
          <FileThumbnail
            tooltip
            imageView
            file={file}
            sx={{ position: 'absolute' }}
            imgSx={{ position: 'absolute' }}
          />

          {onDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(file)}
              sx={{
                top: 4,
                right: 4,
                p: '1px',
                position: 'absolute',
                color: (theme) => alpha(theme.palette.common.white, 0.72),
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                },
              }}
            >
              <Iconify icon="eva:close-fill" width={16} />
            </IconButton>
          )}
        </Stack>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <Stack
        key={key}
        component={m.div}
        {...varFade().inUp}
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{
          my: 1,
          px: 2,
          py: 2,
          borderRadius: 0.75,
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
      >
        <FileThumbnail file={file} />

        <Stack flexGrow={1} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {isNotFormatFile ? file : name}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isNotFormatFile ? '' : fData(size)}
          </Typography>
        </Stack>

        {onDelete && (
          <IconButton edge="end" size="small" onClick={() => onDelete(file)} color="error">
            <Iconify icon="ph:trash-bold" />
          </IconButton>
        )}
      </Stack>
    </AnimatePresence>
  );
}
