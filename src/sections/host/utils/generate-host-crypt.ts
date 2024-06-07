export function generateHostCrypt(host: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomChars = '_';
  for (let i = 0; i < 5; i += 1) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return host + randomChars;
}
