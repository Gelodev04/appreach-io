import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { format } from 'date-fns';
import Image from 'next/image';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useGetSeedAccounts } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';
import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { ISeedForm } from 'src/types/seed';
import { endpoints } from 'src/utils/swr';
import * as Yup from 'yup';

import SeedAccountsGenerator from './seed-accounts-generator';

type Props = {
  currentItem?: ISeedForm;
  numOfSeedsAssigned: number;
  userHosts: { label: string; value: string }[];
};

export default function SeedNewEditForm({ currentItem, numOfSeedsAssigned, userHosts }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const { seedAccounts, totalSeedAccounts: maxSeedAccounts } = useGetSeedAccounts();
  console.log({ seedAccounts, maxSeedAccounts });
  const { enqueueSnackbar } = useSnackbar();
  const { prefillMessage } = useSalesmateChat();
  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    hostId: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required'),
    googleBusiness: Yup.number(),
    googlePersonal: Yup.number(),
    microsoftBusiness: Yup.number(),
    microsoftPersonal: Yup.number(),
    seedAccountsGenerator: Yup.number().max(
      numOfSeedsAssigned,
      `Exceeded ${numOfSeedsAssigned} assigned accounts`
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || format(new Date(), 'MMM do yyyy'),
      hostId: {
        label: '',
        value: '',
      },
      googleBusiness: currentItem?.generate.esps.googleBusiness || 0,
      googlePersonal: currentItem?.generate.esps.googlePersonal || 0,
      microsoftBusiness: currentItem?.generate.esps.microsoftBusiness || 0,
      microsoftPersonal: currentItem?.generate.esps.microsoftPersonal || 0,
      totalSeedAccounts: currentItem?.generate.total || 0,
      seedAccountsGenerator: 0,
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const googleBusiness = watch('googleBusiness');
  const googlePersonal = watch('googlePersonal');
  const microsoftBusiness = watch('microsoftBusiness');
  const microsoftPersonal = watch('microsoftPersonal');

  // const yahooPersonal = watch('yahooPersonal'); not needed anymore

  useEffect(() => {
    if (currentItem) {
      reset(defaultValues);
    }
  }, [currentItem, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(endpoints.seed.create, { method: 'POST', body });

      if (!res.ok) throw new Error('Failed to create seed batch');

      enqueueSnackbar('Create success!');
      router.push(paths.seed.root);
      router.refresh();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleSalesmateOpen = () => {
    prefillMessage('I am interested in more seeds account.');
  };

  const handleTotalSeedAccounts = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let accountToGenerate = parseInt(e.target.value, 10);
    setValue('seedAccountsGenerator', accountToGenerate);
    const individualFields = [
      'googleBusiness',
      'googlePersonal',
      'microsoftBusiness',
      'microsoftPersonal',
    ];
    const sortedSeedsAccount = seedAccounts.sort((a, b) => a.amount - b.amount);

    if (maxSeedAccounts < accountToGenerate) {
      individualFields.forEach((field) => {
        const fieldMax = seedAccounts.find((seed) => seed.name === field)?.amount || 0;
        setValue(field as any, fieldMax);
      });
    } else {
      let remainingAccountToGenerate = accountToGenerate;
      for (let index = 0; index < sortedSeedsAccount.length; index += 1) {
        const currentSeedsAccount = sortedSeedsAccount[index];
        const remainingSeedAccountsToSetValue = sortedSeedsAccount.length - index - 1;
        accountToGenerate -= currentSeedsAccount.amount;
        const checkDivisibleValueForRemainingAccountToSet =
          accountToGenerate / remainingSeedAccountsToSetValue;
        const isDistributable = checkDivisibleValueForRemainingAccountToSet > 1;

        if (isDistributable) {
          setValue(currentSeedsAccount.name as any, currentSeedsAccount.amount);
          remainingAccountToGenerate -= currentSeedsAccount.amount;
        } else {
          const distributedValue = Math.ceil(
            remainingAccountToGenerate / (remainingSeedAccountsToSetValue + 1)
          );
          setValue(currentSeedsAccount.name as any, distributedValue);
          remainingAccountToGenerate -= distributedValue;
        }
      }
    }
  };

  const handleIndividualSeedAccounts = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue(name as any, parseInt(value, 10));
  };

  const totalSeedAccounts = useMemo(() => {
    const googleBusinessCount = googleBusiness ?? 0;
    const googlePersonalCount = googlePersonal ?? 0;
    const microsoftBusinessCount = microsoftBusiness ?? 0;
    const microsoftPersonalCount = microsoftPersonal ?? 0;
    const total =
      googleBusinessCount + googlePersonalCount + microsoftBusinessCount + microsoftPersonalCount;
    setValue('seedAccountsGenerator', total);
    return total;
  }, [googleBusiness, googlePersonal, microsoftBusiness, microsoftPersonal, setValue]);

  const renderProperties = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
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
                placeholder="Assig a name to this list"
                disabled={!!currentItem}
              />

              <RHFAutocomplete
                name="hostId"
                label="Choose sender profile"
                placeholder="outreachmagic"
                options={userHosts}
              />
            </Box>

            <Divider />

            <SeedAccountsGenerator
              assignedCount={numOfSeedsAssigned}
              seedAccounts={seedAccounts || []}
              totalSeedAccounts={totalSeedAccounts}
              onChangeTotalSeedAccounts={handleTotalSeedAccounts}
              onChangeIndividualSeedAccounts={handleIndividualSeedAccounts}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
          <Image
            src="/assets/illustrations/seeds/person.png"
            alt="seeds"
            width={250}
            height={250}
            priority
            quality={100}
          />
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Generate new list
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            You can send to {numOfSeedsAssigned} email accounts each day.{' '}
            <Link href={paths.checkout.root} variant="subtitle2">
              Upgrade your subscription
            </Link>
            . Or{' '}
            <Link variant="subtitle2" sx={{ cursor: 'pointer' }} onClick={handleSalesmateOpen}>
              contact us
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
            {!currentItem ? 'Generate list' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderProperties}
      </Grid>
    </FormProvider>
  );
}
