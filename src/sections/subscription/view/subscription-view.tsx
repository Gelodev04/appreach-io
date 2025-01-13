'use client';

import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';

import { UserSettingsPlan } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckoutElementV2 } from 'src/app/(pages)/subscription/_component/checkout-element';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE, TRIAL_STATUS } from 'src/config-global';
import { env } from 'src/data/env/client';
import { useBoolean } from 'src/hooks/use-boolean';
import { cancelSubscription, updateSubcription } from 'src/services/stripe/subscription';
import type { SubscriptionData } from 'src/types/stripe';
import {
  createSubscriptionSession,
  getSubscriptionData,
  redirectToCheckout,
} from 'src/utils/stripe';

import { useResponsive } from 'src/hooks/use-responsive';
import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { calculateRemainingDays } from 'src/utils';
import { UpgradeDowngradeConfirmDialogV2 } from '../upgrade-downgrade-confirm-dialog-v2';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type SubscriptionviewType = {
  subscription: UserSettingsPlan | null;
};

export default function SubscriptionView({ subscription }: SubscriptionviewType) {
  // Snackbar for notifications
  const { enqueueSnackbar } = useSnackbar();
  const lgUp = useResponsive('up', 'lg');

  // Prefill message for 'Contact Us'
  const { prefillMessage } = useSalesmateChat();

  // Subscription state management
  const [nextPlan, setNextPlan] = useState<SubscriptionData>();
  const [type, setType] = useState<'downgrade' | 'upgrade'>('upgrade');

  // Session and routing
  const { data: session } = useSession();
  const router = useRouter();

  // Confirmation dialogs
  const confirmCancel = useBoolean();
  const confirmUpgradeDowngrade = useBoolean();
  const isTrialExpired = subscription?.status === TRIAL_STATUS.CANCELED;
  const expiredDate = isTrialExpired
    ? 0
    : subscription?.current_period_end && calculateRemainingDays(subscription?.current_period_end);
  const handleSubscribe = async (priceId: string) => {
    const stripe: Stripe | null = await stripePromise;
    if (!stripe) return;

    try {
      const email = session?.user.email;
      if (!email) throw new Error('Email is required for checkout.');
      else {
        const sessionId = await createSubscriptionSession(email, priceId);
        await redirectToCheckout(sessionId);
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error', persist: true });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription(subscription?.subscription_id ?? '');
      enqueueSnackbar(
        'Subscription cancelled successfully. (Note: if not updated please refresh the browser.)',
        {
          variant: 'success',
          persist: true,
        }
      );
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error', persist: true });
    } finally {
      confirmCancel.onFalse();
    }
  };

  const handleUpgradeDowngrade = async () => {
    try {
      if (subscription?.status === 'active' && nextPlan?.priceId) {
        if (!subscription.subscription_id) {
          throw new Error('No subscription Id found');
        }
        await updateSubcription(subscription.subscription_id, nextPlan.priceId);
        router.refresh();
        enqueueSnackbar(
          `Updated the plan successfully. (Note: if not updated please refresh the browser.)`,
          { variant: 'success', persist: true }
        );
        confirmUpgradeDowngrade.setValue(false);
      } else {
        enqueueSnackbar(`Unable to ${type}.`, { variant: 'error', persist: true });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Unable to downgrade or upgrade', error);
    }
  };

  const handlePlanSelection = (plan: SubscriptionData) => {
    const currentSubcription = getSubmitTitle(plan.key);
    const isCurrentPlan = subscription?.lookup_key === plan.key;
    const isSubscriptionCancelled = subscription?.status === 'canceled';
    // Handle upgrade or downgrade confirmation
    if (subscription && !isCurrentPlan && !isSubscriptionCancelled) {
      confirmUpgradeDowngrade.setValue(true);
      setType(currentSubcription.toLowerCase() as 'downgrade' | 'upgrade');
      setNextPlan(plan);
      return;
    }

    if (isSubscriptionCancelled) return handleSubscribe(plan.priceId);

    // Handle current plan actions
    if (isCurrentPlan) return confirmCancel.onTrue();

    // Handle plan switching
    if (subscription) return handleSubscribe(plan.priceId);

    // Default case - upgrade to higher plan
    return handleSubscribe(plan.priceId);
  };

  const getSubmitTitle = (planKey: string) => {
    if (!subscription) return 'Upgrade';

    const isCanceled = subscription?.status === 'canceled';
    if (!isCanceled && planKey === subscription.lookup_key) return 'Cancel plan';

    if (subscription.lookup_key === STRIPE.subscriptions.trial.key) return 'Upgrade';

    if (subscription.lookup_key === STRIPE.subscriptions.custom.key) return 'Downgrade';

    if (!subscription.price_id) {
      throw new Error('No subscription price id');
    }

    const currentPlanData = getSubscriptionData(subscription.price_id);
    const nextPlanData = Object.values(STRIPE.subscriptions).find((plan) => plan.key === planKey);

    if (currentPlanData && nextPlanData) {
      return nextPlanData.order < currentPlanData.order ? 'Downgrade' : 'Upgrade';
    }

    return 'Upgrade';
  };

  const renderHead = (
    <Stack justifyContent="center" alignItems="center" textAlign="center" spacing={1}>
      {lgUp && <Logo />}
      <Typography variant="h4" color="text.primary">
        Upgrade Or Downgrade Anytime
      </Typography>
    </Stack>
  );

  const renderWarning = isTrialExpired ? (
    <Alert
      variant="filled"
      severity="info"
      sx={{ mt: 1, backgroundColor: '#212B36', fontWeight: '700' }}
    >
      Your trial has expired.
    </Alert>
  ) : (
    <Alert variant="standard" severity="warning" sx={{ mt: 1 }}>
      {`You are on a free trial mode. You have ${expiredDate} remaining days for trial version. Consider upgrading
    to a paid plan for additional features and benefits!`}
    </Alert>
  );

  const renderOptions = (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CheckoutElementV2
        name={STRIPE.subscriptions.starter.key}
        title="Starter"
        subtitle="100 Seed Accounts"
        onSubmit={() => handlePlanSelection(STRIPE.subscriptions.starter)}
        price={STRIPE.subscriptions.starter.price}
        features={[
          'Send up to 100 emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Includes 1 sender profile',
          'Email and live chat support included',
        ]}
        currentPlan={subscription?.lookup_key?.toLocaleLowerCase()}
        planStatus={subscription?.status}
        expirationDate={subscription?.current_period_end}
      />
      <CheckoutElementV2
        title="Established"
        name={STRIPE.subscriptions.established.key}
        subtitle="500 Seed Accounts*"
        onSubmit={() => handlePlanSelection(STRIPE.subscriptions.established)}
        price={STRIPE.subscriptions.established.price}
        features={[
          'Send up to 500 emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Includes 5 sender profile',
          'Email and live chat support included',
        ]}
        comment="*Additional senders and seed accounts available. Contact us about your specific use case."
        currentPlan={subscription?.lookup_key?.toLocaleLowerCase()}
        planStatus={subscription?.status}
        expirationDate={subscription?.current_period_end}
      />
      <CheckoutElementV2
        title="Managed Service"
        name={STRIPE.subscriptions.custom.key}
        subtitle="Contact Us"
        onSubmit={() => prefillMessage('I am interested in more seeds account.')}
        features={[
          'Send 500+ emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Think of us as part of your team',
          '1-on-1 zoom calls',
        ]}
        currentPlan={subscription?.lookup_key?.toLocaleLowerCase()}
        planStatus={subscription?.status}
        expirationDate={subscription?.current_period_end}
      />
    </Box>
  );

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {subscription?.lookup_key === STRIPE.subscriptions.trial.key && renderWarning}
        <Stack
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="100%"
          width="100%"
          spacing={4}
          sx={{ padding: 0, margin: '0 auto' }}
        >
          {renderHead}
          {renderOptions}
        </Stack>
      </Container>

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title="Confirm cancel"
        hideCancelButton
        content="Are you sure you want to cancel? You will lose access at the end of your billing period"
        action={
          <>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Cancel Plan
            </Button>
            <Button variant="outlined" onClick={confirmCancel.onFalse}>
              Do Not Cancel
            </Button>
          </>
        }
      />

      <UpgradeDowngradeConfirmDialogV2
        open={confirmUpgradeDowngrade.value}
        onClose={confirmUpgradeDowngrade.onFalse}
        nextPlan={nextPlan}
        onConfirm={handleUpgradeDowngrade}
        type={type}
      />
    </>
  );
}
