'use client';

import { Icon } from '@iconify/react';
import { Box, Card, Slider, Typography, useMediaQuery } from '@mui/material';

type SliderProps = {
  sliderTitle: string;
  icon: string;
  description: string;
  tooltipContent?: string;
  disabled?: boolean;
};

export const SliderItem = ({
  sliderTitle,
  icon,
  description,
  tooltipContent,
  disabled,
}: SliderProps) => {
  const matches = useMediaQuery('(min-width:768px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: matches ? 'row' : 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '120px',
          padding: 1.5,
          minHeight: '120px',
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon color={disabled ? '#94A0AE' : '#003087'} icon={icon} width={35} />
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: disabled ? '#94A0AE' : 'black' }}
          >
            {sliderTitle}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            position: 'absolute',
            right: -10,
            top: -10,
            padding: '3px',
            color: '#9F9F9F',
          }}
        >
          <Icon width={20} icon={'material-symbols:info-outline'} />
        </Box>
      </Card>
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%' }}>
        <Box>
          <Slider
            disabled={disabled}
            size="medium"
            min={0}
            max={1000}
            defaultValue={250}
            valueLabelDisplay="auto"
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              color: disabled ? '#94A0AE' : 'black',
            }}
          >
            <Typography>250</Typography>
            <Typography>1000</Typography>
          </Box>
        </Box>
        <Typography sx={{ textAlign: 'center', color: disabled ? '#94A0AE' : 'black' }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};
