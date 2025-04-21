import { STRIPE } from 'src/config-global';

type buttonVariantColor =
  | 'inherit'
  | 'primary'
  | 'error'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | undefined;

export default function useGetSubmitTitle({
  name,
  planStatus,
  currentPlan,
  expirationDate,
}: {
  name: string;
  planStatus?: string | null;
  currentPlan?: string | null;
  expirationDate?: Date | null;
}) {
  let submitSubtitle;
  const isPlanCancelled = planStatus === 'canceled';
  const isExpired = expirationDate && expirationDate < new Date();
  let submitButtonVariant: buttonVariantColor = 'primary';
  let submitTitle = currentPlan === 'custom' && 'Downgrade';

  if (name === STRIPE.subscriptions.starter.key) {
    if (!currentPlan || currentPlan === STRIPE.subscriptions.trial.key) {
      submitTitle = 'Upgrade';
    } else if (currentPlan === 'established') {
      submitTitle = 'Downgrade';
    } else if (currentPlan === 'starter') {
      if (isPlanCancelled) {
        submitTitle = 'Upgrade';
        submitSubtitle = isExpired ? undefined : `Expires on: ${expirationDate?.toDateString()}`;
      } else {
        submitTitle = 'Cancel';
        submitSubtitle = 'Current Plan';
      }
    }
  }

  if (name === STRIPE.subscriptions.established.key) {
    if (!currentPlan || currentPlan === STRIPE.subscriptions.trial.key) {
      submitTitle = 'Upgrade';
    } else if (currentPlan === 'starter') {
      submitTitle = 'Upgrade';
    } else if (currentPlan === 'established') {
      if (isPlanCancelled) {
        submitTitle = 'Upgrade';
        submitSubtitle = isExpired ? undefined : `Expires on: ${expirationDate?.toDateString()}`;
      } else {
        submitTitle = 'Cancel';
        submitSubtitle = 'Current Plan';
      }
    }
  }

  if (name === 'custom') {
    submitTitle = 'Contact Us';
  }

  if (submitTitle === 'Upgrade' || submitTitle === 'Downgrade') {
    submitButtonVariant = 'primary';
  } else {
    submitButtonVariant = 'error';
  }

  return {
    submitSubtitle,
    submitTitle,
    submitButtonVariant,
    isCancelledButNotExpired: isPlanCancelled && !isExpired,
  };
}
