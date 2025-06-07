'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Link, Stack, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import UploadDocument from 'src/components/upload/upload-document';
import { useGetSeedSettings } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import {
  attributeUploadsWebhook,
  createAttributeUploads,
} from 'src/services/db/attributes-uploads';
import { CreateAttributeUploadsPropType } from 'src/types/attribute-uploads';
import { PlatformOptionsType } from 'src/types/dropdown-types';
import { normalizeHeader } from 'src/utils';
import { parseCSVFile } from 'src/utils/csv-parse';
import { handleFileUpload } from 'src/utils/upload-file-to-signed-url';
import * as Yup from 'yup';
import { useValidationErrors } from '../../_hooks/useValidationErrors';
import { VisibleOnScrollTooltip } from './visible-on-screen-tootip';

type NewHostFormData = {
  name: string;
  host_id: { label: string; value: string } | null;
  proceedAnyway: Record<string, boolean>;
};

export const NewAttributesForm = ({
  columnOptions,
  columnValidation,
  headerMapping,
}: {
  columnOptions: PlatformOptionsType;
  columnValidation: { value: string; regex: string; format_description: string }[];
  headerMapping: Record<string, string>;
}) => {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const { hosts } = useGetSeedSettings();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<null | string>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappedCols, setMappedCols] = useState<Record<string, string>>({});
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [csvData, setCsvData] = useState([]);
  const scrollContainerRef = useRef(null);
  const {
    validationErrors,
    validateAll,
    validateSingle,
    resetValidationErrors,
    clearValidationError,
  } = useValidationErrors();

  const router = useRouter();
  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('List name is required'),
    host_id: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required')
      .nullable()
      .notOneOf([null], 'Sender profile is required'),
    proceedAnyway: Yup.object<Record<string, boolean>>().default({}),
  });

  const defaultValues: NewHostFormData = useMemo(
    () => ({
      name: '',
      host_id: null,
      proceedAnyway: {},
    }),
    []
  );

  const methods = useForm<NewHostFormData>({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!file) {
      setFileError('CSV File is required.');
      return;
    }

    // Determine which columns have errors
    const columnsWithErrors = Object.keys(validationErrors);
    // Check if all columns with errors have the corresponding proceed checkbox checked
    const uncheckedColumns = columnsWithErrors.filter((header) => !data.proceedAnyway?.[header]);

    if (columnsWithErrors.length > 0 && uncheckedColumns.length > 0) {
      enqueueSnackbar('Please acknowledge the errors by checking all "Proceed Anyway" boxes.', {
        variant: 'error',
        persist: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to cloud bucket
      const uploadResult = await handleFileUpload(formData, 'attribute');
      if (uploadResult?.error) {
        enqueueSnackbar(uploadResult.error, { variant: 'error', persist: true });
        return;
      }

      // Create document in the database
      const databaseResponse = await createAttributeUploads(
        data as CreateAttributeUploadsPropType,
        uploadResult.url as string,
        mappedCols
      );

      if (databaseResponse?.error) {
        enqueueSnackbar(databaseResponse.error, { variant: 'error', persist: true });
        return;
      }

      // Increment attribute credits and trigger webhook
      await attributeUploadsWebhook();

      enqueueSnackbar('Uploaded successfully');
      router.push(paths.attributesUpload.root);
      router.refresh();

      setFileError(null);
    } catch (error) {
      console.error('File upload failed', error);
      enqueueSnackbar('An unexpected error occurred during the file upload.', {
        variant: 'error',
        persist: true,
      });
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];

      if (!uploadedFile) return;

      setValue('name', uploadedFile.name);
      setFile(uploadedFile);
      setFileError(null);

      try {
        // Parse CSV file
        const result = await parseCSVFile(uploadedFile);
        const headers = result.meta.fields || [];
        const { data } = result;

        // Update state to open form
        setCsvHeaders(headers);
        setCsvData(data);

        // Prefill mappedCols based on predefined mappings, ensuring unique assignments
        const usedMappings: Record<string, boolean> = {}; // Tracks assigned values

        const initialMappedCols = headers.reduce(
          (acc: Record<string, string>, header: string) => {
            const normalizedHeader = normalizeHeader(header);
            const mappedValue = headerMapping[normalizedHeader as keyof typeof headerMapping] || '';

            if (mappedValue && !usedMappings[mappedValue]) {
              usedMappings[mappedValue] = true; // Mark this value as used
              acc[header] = mappedValue; // Assign the mapped value to the header
            }

            return acc;
          },
          {} as Record<string, string>
        );

        // Pre-populate selectedValues with unique prefilled mappings
        const prefilledValues = Object.keys(usedMappings);
        setMappedCols(initialMappedCols);
        setSelectedValues(prefilledValues);
        validateAll(initialMappedCols, data, columnValidation);
      } catch (error) {
        console.error('CSV Parsing Error', error);
        setFileError('Error parsing CSV file. Please check the format.');
      }
    },
    [headerMapping, columnValidation, validateAll, setValue]
  );

  const handleRemoveFile = () => {
    setFile(null);
    setCsvHeaders([]);
    setMappedCols({});
    setSelectedValues([]);
    resetValidationErrors();

    setValue('name', '');
  };

  const handleColumnChange = (newValue: any, header: string) => {
    const previousValue = mappedCols[header];
    const newMappedCols = {
      ...mappedCols,
      [header]: newValue ? newValue.value : '',
    };

    let updatedSelectedValues = [...selectedValues];

    // Remove the previous value if it exists
    if (previousValue) {
      updatedSelectedValues = updatedSelectedValues.filter((value) => value !== previousValue);
    }

    // Add the new value if it exists and isn't already added
    if (newValue?.value) {
      updatedSelectedValues.push(newValue.value);
    }

    // Perform regex validation on the column data
    const validator = columnValidation.find((v) => v.value === newValue?.value);

    if (validator && validator.regex) {
      validateSingle(header, newValue.value, csvData, columnValidation);
    } else {
      clearValidationError(header);
    }

    setMappedCols(newMappedCols);
    setSelectedValues(updatedSelectedValues);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField
                  name="name"
                  label="List name"
                  placeholder="Assign a name to this list"
                />

                <RHFAutocomplete
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  name="host_id"
                  label="Choose sender profile"
                  placeholder="outreachmagic"
                  options={hostOptions}
                />
              </Box>
              <UploadDocument
                file={file}
                fileError={fileError}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
                accept={{ 'text/csv': [] }}
              />
            </Stack>
            {csvHeaders.length > 0 && (
              <Stack
                ref={scrollContainerRef}
                spacing={2}
                sx={{ mt: 2, overflowY: 'auto', maxHeight: '700px' }}
              >
                <Box sx={{ padding: 3 }}>
                  {csvHeaders.map((header) => {
                    const error = validationErrors[header];

                    const maxVisibleRows = 10;
                    const invalidLines = error?.invalid.map((item) => item.line) || [];

                    const tooltipMessage =
                      invalidLines.length > maxVisibleRows
                        ? `Invalid value(s) on row(s): ${invalidLines
                            .slice(0, maxVisibleRows)
                            .join(', ')}... (+${invalidLines.length - maxVisibleRows} more)`
                        : `Invalid value(s) on row(s): ${invalidLines.join(', ')}`;

                    let rowsToDisplay = [];
                    if (error && error.invalid?.length > 0) {
                      // If there's an error, get the first 3 invalid items
                      rowsToDisplay = error.invalid.slice(0, 3).map((invalidItem) => ({
                        value: invalidItem.value,
                        lineNumber: invalidItem.line,
                        isError: true,
                      }));
                    } else {
                      // Otherwise, get the first 3 normal data rows
                      rowsToDisplay = csvData.slice(0, 3).map((data, index) => ({
                        value: data[header],
                        lineNumber: index + 1,
                        isError: false,
                      }));
                    }

                    return (
                      <Box
                        key={header}
                        columnGap={2}
                        rowGap={3}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        }}
                        sx={{ padding: 3 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Typography variant="subtitle1">{header}</Typography>
                            {error && (
                              <VisibleOnScrollTooltip
                                title={tooltipMessage}
                                placement="top"
                                PopperProps={{ disablePortal: true }}
                                scrollContainerRef={scrollContainerRef}
                                slotProps={{
                                  popper: {
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: { offset: [0, -5] },
                                      },
                                    ],
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'error.main',
                                    borderRadius: '100%',
                                    width: 24,
                                    height: 24,
                                    transition: 'background-color 0.3s ease',
                                    '&:hover': {
                                      background: 'rgba(255, 0, 0, 0.1)',
                                    },
                                  }}
                                >
                                  <Iconify icon="material-symbols:exclamation-rounded" />
                                </Box>
                              </VisibleOnScrollTooltip>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {rowsToDisplay.map((row, i) => {
                              const { value, lineNumber, isError } = row;

                              return (
                                <Box
                                  sx={{
                                    borderLeft: `1px solid ${isError ? 'red' : 'lightgray'}`,
                                    borderRight: `1px solid ${isError ? 'red' : 'lightgray'}`,
                                    borderBottom: `1px solid ${isError ? 'red' : 'lightgray'}`,
                                    ...(i === 0 && {
                                      borderTop: `1px solid ${isError ? 'red' : 'lightgray'}`,
                                    }),
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    padding: 1,
                                    color: isError ? 'error.main' : 'text.secondary',
                                  }}
                                  key={`${header}-${lineNumber}-${i}`}
                                >
                                  {value
                                    ? `${lineNumber}. ${String(value).slice(0, 300)}${
                                        String(value).length > 300 ? '...' : ''
                                      }`
                                    : `${lineNumber}. No Value`}
                                </Box>
                              );
                            })}
                            {validationErrors[header] && (
                              <Typography
                                variant="body2"
                                color="error.main"
                                sx={{
                                  wordBreak: 'break-word',
                                  overflowWrap: 'anywhere',
                                  whiteSpace: 'normal',
                                }}
                              >
                                {validationErrors[header].format}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ visibility: 'hidden' }}>
                            Belongs to
                          </Typography>

                          <RHFAutocomplete
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            name={`mapping.${header}`}
                            label="Set column name"
                            value={
                              columnOptions.find((opt) => opt.value === mappedCols[header]) || null
                            }
                            onChange={(_, newValue) => handleColumnChange(newValue, header)}
                            options={columnOptions.filter(
                              (opt) =>
                                !selectedValues.includes(opt.value) ||
                                mappedCols[header] === opt.value
                            )}
                          />

                          {error && (
                            <Box sx={{ alignSelf: 'center' }}>
                              <RHFCheckbox
                                name={`proceedAnyway.${header}`}
                                label={`${invalidLines.length} rows have errors, proceed anyway?`}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
            <Image
              src="/assets/illustrations/seeds/person.png"
              alt="seeds"
              width={220}
              height={220}
              priority
              quality={100}
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Upload CSV List
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Upload a csv file with your lead attributes.{' '}
              <Link
                href={paths.support.link}
                target="_blank"
                variant="subtitle2"
                sx={{ cursor: 'pointer' }}
              >
                Contact support
              </Link>{' '}
              if you have questions.
            </Typography>

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{ boxShadow: theme.customShadows.primary }}
            >
              Upload Attributes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
