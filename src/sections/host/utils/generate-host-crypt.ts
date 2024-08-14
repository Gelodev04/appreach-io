import crypto from 'crypto';

export function generateRandomChars(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomChars = '';
  for (let i = 0; i < 5; i += 1) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomChars;
}

export function generateHostCrypt(host: string): string {
  const secretKey = 'da65e7ec-7de9-420c-b00d-5b12e6754c06'; // Hardcoded
  const hash = crypto.createHash('sha1');
  hash.update(secretKey + host);
  const longHash = hash.digest();

  const encodedHash = Buffer.from(longHash).toString('base64url');
  return `${host}_${encodedHash.slice(0, 5)}`;
}
