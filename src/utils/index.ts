export const getEmailDomain = (email: string): string | undefined => {
  const regex = /@([a-zA-Z0-9.-]+)/; // Regex to match the domain
  const match = email.match(regex); // Match the regex against the email

  return match ? match[1] : undefined; // Return the domain or null if not found
};

export const calculateRemainingDays = (inputDate: Date) => {
  const currentDate = new Date();
  const expirationDate = new Date(inputDate ?? 0);
  const timeDiff = expirationDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
};

export const normalizeHeader = (header: string) => {
  return header
    .replace(/LinkedIn/gi, 'Linkedin') // Prevent "Linked in" from splitting
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters (camelCase)
    .replace(/_/g, ' ') // Replace underscores with spaces first
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters like {{ }}
    .trim()
    .toLowerCase();
};

export const mapDisplayValueToLabelValue = <T extends { display: string; value: string }>(
  options: T[]
) => {
  return options.map((option) => ({
    label: option.display,
    value: option.value,
  }));
};

export const mapColumnValidation = <
  T extends { value: string; regex: string; format_description: string },
>(
  options: T[]
) => {
  return options.map((option) => ({
    value: option.value,
    regex: option.regex,
    format_description: option.format_description,
  }));
};
