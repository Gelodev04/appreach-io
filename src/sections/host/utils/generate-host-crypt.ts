export function generateRandomChars(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomChars = '';
  for (let i = 0; i < 5; i += 1) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomChars;
}

export function generateHostCrypt(host: string): string {
  const randomChars = generateRandomChars();
  return `${host  }_${  randomChars}`;
}