'use client';

import { Icon } from '@iconify/react';
import { Box, Card, Popover, Slider, Typography, useMediaQuery } from '@mui/material';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type SliderProps = {
  sliderTitle: string;
  sliderName: string;
  icon: string;
  description: string;
  tooltipContent?: string;
  maxVal: number;
  disabled?: boolean;
};

export const SliderItem = ({
  sliderTitle,
  sliderName,
  icon,
  description,
  tooltipContent = 'Tooltip content',
  maxVal,
  disabled,
}: SliderProps) => {
  const [openedPopover, setOpenedPopover] = useState(false);
  const { control } = useFormContext();
  const matches = useMediaQuery('(min-width:768px)');
  const popoverAnchor = useRef(null);

  const handleSliderChange = (fieldOnChange: (value: any) => void, value: number | number[]) => {
    fieldOnChange(value);
  };

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    setOpenedPopover(false);
  };

  const updatedDesc = (value: number) => {
    const computedValue = (value / 100) * maxVal;

    return description
      .replace('{value}', String(computedValue.toFixed(0)))
      .replace('{max_value}', String(maxVal));
  };

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
          maxWidth: matches ? '120px' : 'none',
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
          ref={popoverAnchor}
          aria-owns={openedPopover ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={popoverEnter}
          onMouseLeave={popoverLeave}
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
          <Icon width={20} icon="material-symbols:info-outline" />
        </Box>

        {tooltipContent && (
          <Popover
            id="mouse-over-popover"
            open={openedPopover}
            anchorEl={popoverAnchor.current}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onMouseEnter={popoverEnter}
            onMouseLeave={popoverLeave}
            slotProps={{ paper: { sx: { pointerEvents: 'auto' } } }}
            sx={{ pointerEvents: 'none' }}
          >
            <Box sx={{ maxWidth: '300px', padding: 1 }}>
              <Typography variant="body2">{tooltipContent}</Typography>
            </Box>
          </Popover>
        )}
      </Card>
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%' }}>
        <Controller
          name={sliderName}
          control={control}
          disabled={disabled}
          render={({ field }) => (
            <Box>
              <Slider
                {...field}
                value={field.value}
                size="medium"
                onChange={(_, value) => handleSliderChange(field.onChange, value)}
                min={0}
                max={100}
                defaultValue={25}
                valueLabelDisplay="auto"
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: disabled ? '#94A0AE' : 'black',
                }}
              >
                <Typography>{field.value}%</Typography>
                <Typography>100%</Typography>
              </Box>

              <Typography sx={{ textAlign: 'center', color: disabled ? '#94A0AE' : 'black' }}>
                {updatedDesc(field.value)}
              </Typography>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};
