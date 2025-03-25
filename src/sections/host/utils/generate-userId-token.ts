import crypto from 'crypto';
import { env } from 'src/data/env/server';
/**
 * Generates a 20-character base64url token from an ObjectId and secret
 */
export function generateTokenFromObjectId(objectId: string): string {
  const secretKey = env.HOST_CRYPT_SECRET as string;
  // Create SHA-1 hash
  const hash = crypto.createHash('sha1');
  hash.update(secretKey + objectId);
  const digest = hash.digest(); // Buffer output

  // Convert to base64url encoding (URL-safe)
  const base64url = digest
    .toString('base64')
    .replace(/\+/g, '-') // Convert + to -
    .replace(/\//g, '_') // Convert / to _
    .replace(/=+$/, ''); // Remove trailing =

  // Return the first 20 characters
  return base64url.slice(0, 20);
}
