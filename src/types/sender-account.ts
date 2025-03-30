export type CreateSenderAccountData = {
  linkedinUrl: string;
  senderName: string;
  hostId: {
    label: string;
    value: string;
  } | null;
};
