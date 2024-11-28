export const getEmailDomain = (email: string): string | undefined => {
  const regex = /@([a-zA-Z0-9.-]+)/; // Regex to match the domain
  const match = email.match(regex); // Match the regex against the email

  return match ? match[1] : undefined; // Return the domain or null if not found
};
