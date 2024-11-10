export interface SubscriptionData {
  key: string;
  name: string;
  product: string;
  priceId: string;
  price: number;
  order: number;
}

export interface StripeSubscription {
  id: string;
  object: string;
  application: any;
  application_fee_percent: any;
  automatic_tax: {
    enabled: boolean;
    liability: any;
  };
  billing_cycle_anchor: number;
  billing_cycle_anchor_config: any;
  billing_thresholds: any;
  cancel_at: any;
  cancel_at_period_end: boolean;
  canceled_at: any;
  cancellation_details: {
    comment: any;
    feedback: any;
    reason: any;
  };
  collection_method: string;
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due: any;
  default_payment_method: {
    id: string;
    object: string;
    allow_redisplay: string;
    billing_details: {
      address: Address;
      email: string;
      name: string;
      phone: any;
    };
    card: Card;
    created: number;
    customer: string;
    livemode: boolean;
    metadata: Metadata;
    type: string;
  };
  default_source: any;
  default_tax_rates: any[];
  description: any;
  discount: any;
  discounts: any[];
  ended_at: any;
  invoice_settings: InvoiceSettings;
  items: Items;
  latest_invoice: string;
  livemode: boolean;
  metadata: Metadata;
  next_pending_invoice_item_invoice: any;
  on_behalf_of: any;
  pause_collection: any;
  payment_settings: PaymentSettings;
  pending_invoice_item_interval: any;
  pending_setup_intent: any;
  pending_update: any;
  plan: StripeSubscriptionPlan;
  quantity: number;
  schedule: any;
  start_date: number;
  status: string;
  test_clock: any;
  transfer_data: any;
  trial_end: number;
  trial_settings: {
    end_behavior: {
      missing_payment_method: string;
    };
  };
  trial_start: number;
}
export interface StripeSubscriptionPlan {
  id: string;
  object: string;
  active: boolean;
  aggregate_usage: any;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: Metadata;
  meter: any;
  nickname: any;
  product: string;
  tiers_mode: any;
  transform_usage: any;
  trial_period_days: any;
  usage_type: string;
}

export interface UserSubscriptionPlan {
  price_id: string;
  subscription_id: string;
  amount: number;
  amount_decimal: string;
  lookup_key: string;
  start_date: string;
  current_period_end: string;
  status:
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
    | 'paused';
}

interface Address {
  city: any;
  country: string;
  line1: any;
  line2: any;
  postal_code: any;
  state: any;
}

interface Card {
  brand: string;
  checks: Checks;
  country: string;
  display_brand: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  generated_from: any;
  last4: string;
  networks: Networks;
  three_d_secure_usage: ThreeDSecureUsage;
  wallet: any;
}

interface Checks {
  address_line1_check: any;
  address_postal_code_check: any;
  cvc_check: string;
}

interface Networks {
  available: string[];
  preferred: any;
}

interface ThreeDSecureUsage {
  supported: boolean;
}

interface Metadata {}

interface InvoiceSettings {
  account_tax_ids: any;
  issuer: {
    type: string;
  };
}

interface Items {
  object: string;
  data: Daum[];
  has_more: boolean;
  total_count: number;
  url: string;
}

interface Daum {
  id: string;
  object: string;
  billing_thresholds: any;
  created: number;
  discounts: any[];
  metadata: Metadata;
  plan: StripeSubscriptionPlan;
  price: Price;
  quantity: number;
  subscription: string;
  tax_rates: any[];
}

interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: any;
  livemode: boolean;
  lookup_key: any;
  metadata: Metadata;
  nickname: any;
  product: string;
  recurring: {
    aggregate_usage: any;
    interval: string;
    interval_count: number;
    meter: any;
    trial_period_days: any;
    usage_type: string;
  };
  tax_behavior: string;
  tiers_mode: any;
  transform_quantity: any;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

interface PaymentSettings {
  payment_method_options: {
    acss_debit: any;
    bancontact: any;
    card: Card2;
    customer_balance: any;
    konbini: any;
    sepa_debit: any;
    us_bank_account: any;
  };
  payment_method_types: any;
  save_default_payment_method: string;
}

interface Card2 {
  network: any;
  request_three_d_secure: string;
}
