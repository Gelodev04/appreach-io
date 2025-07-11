import crypto from 'crypto';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

// Generate a unique 32-character alphanumeric API key with collision detection
export const generateApiKey = async (): Promise<string> => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('userSettings');

  const generate = async (): Promise<string> => {
    // Generate random bytes and convert to base64, then filter alphanumeric chars
    let key = '';
    while (key.length < 32) {
      const part = crypto
        .randomBytes(24)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '');
      key += part;
    }
    key = key.slice(0, 32); // Ensure exactly 32 characters

    // Check if this key already exists
    const found = await collection.findOne({
      'api.token': key,
    });

    return found ? generate() : key;
  };

  return generate();
};
