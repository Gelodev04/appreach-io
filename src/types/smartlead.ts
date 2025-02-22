export type UpdateSmartleadEsp = {
  esp: string;
  espCamelCase: string;
  server: string;
};

export type UpdateSmartlead = {
  hostId: string;
  hostName: string;
} & UpdateSmartleadEsp;
