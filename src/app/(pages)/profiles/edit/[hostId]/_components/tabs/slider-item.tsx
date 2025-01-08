'use client';

import { Icon } from '@iconify/react';
import { Box, Card, Paper, Popover, Slider, Typography, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type SliderProps = {
  sliderTitle: string;
  sliderName: string;
  icon: string;
  description: string;
  tooltipContent?: string;
  maxVal: number;
  engagementMax: number;
  disabled?: boolean;
};

export const SliderItem = ({
  sliderTitle,
  sliderName,
  icon,
  description,
  tooltipContent = 'Tooltip content',
  maxVal,
  engagementMax,
  disabled,
}: SliderProps) => {
  const [openedPopover, setOpenedPopover] = useState(false);
  const { control } = useFormContext();
  const matches = useMediaQuery('(min-width:768px)');
  const popoverAnchor = useRef(null);

  const maxValueAlert = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography variant="body1">
        Max engagement value of {engagementMax}% on your current plan.{' '}
      </Typography>
      <Typography variant="body1" sx={{ color: 'primary' }}>
        Upgrade your <Link href={'/subscription'}>subscription</Link>
      </Typography>
    </Box>
  );

  const handleSliderChange = (fieldOnChange: (value: any) => void, value: number | number[]) => {
    if ((value as number) > engagementMax) {
      fieldOnChange(engagementMax);
      enqueueSnackbar(maxValueAlert, {
        variant: 'error',
      });
    } else {
      fieldOnChange(value);
    }
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
        padding: '1rem',
        position: 'relative',
        '&:hover > .setting-disabled-tooltip': {
          opacity: 1,
          visibility: 'visible',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: matches ? 'row' : 'column',
          alignItems: 'center',
          width: '100%',
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
            <Icon color={'#003087'} icon={icon} width={35} />
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'black' }}>
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
                    color: 'black',
                  }}
                >
                  <Typography>{field.value}%</Typography>
                  <Typography>100%</Typography>
                </Box>

                <Typography sx={{ textAlign: 'center', color: 'black' }}>
                  {updatedDesc(field.value)}
                </Typography>
              </Box>
            )}
          />
        </Box>
      </Box>
      {disabled && (
        <Box
          className="setting-disabled-tooltip"
          sx={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: ' rgba(202, 202, 202, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
          }}
        >
          <Box
            sx={{
              width: '80%',
              display: 'flex',
            }}
          >
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                height: '100%',
                padding: '1rem',
              }}
            >
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Setting not enabled
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Update your <Link href={'/subscription'}>subscription</Link>
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};
