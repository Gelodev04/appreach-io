export type CreateSenderAccountData = {
  linkedinUrl: string;
  senderLabel: string;
  hostId: {
    label: string;
    value: string;
  } | null;
};
