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
export function getScrollbarSize(doc?: Document): number {
  let scrollbarSize: number | undefined;
  const documentNode = doc || (typeof document !== 'undefined' ? document : undefined);

  if (typeof window === 'undefined' || !documentNode) {
    return 0;
  }

  if (scrollbarSize !== undefined) {
    return scrollbarSize;
  }

  const scrollDiv = documentNode.createElement('div');

  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.left = '-9999px';

  documentNode.body.appendChild(scrollDiv);

  scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  documentNode.body.removeChild(scrollDiv);

  return scrollbarSize;
}

export const splitFirstUnderscore = (str: string) => {
  const index = str.indexOf('_');
  if (index === -1) return str; // no underscore found
  return str.substring(0, index);
};

export const parseCompanyId = (str: string) => {
  // Remove trailing comma if present
  const cleanStr = str.trim().replace(/,$/, '');

  // Split by |
  const [leftPart, linkedIn] = cleanStr.split('|');

  // Split left part by _ if present
  const baseId = leftPart.includes('_') ? leftPart.split('_')[0] : leftPart;

  // Return both parts
  return {
    baseId,
    linkedIn,
  };
};
