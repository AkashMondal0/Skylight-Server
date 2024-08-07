import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
const scryptAsync = promisify(scrypt);

const encrypt = async (text: string, token: string) => {
  const iv = randomBytes(16); // Initialization vector
  const salt = randomBytes(16); // Salt for key derivation

  // Derive a key from the password and salt
  const key = (await scryptAsync(token, salt, 32)) as Buffer;

  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  // Combine salt, iv, and encrypted text into a single buffer for storage
  return Buffer.concat([salt, iv, encryptedText]).toString('hex');
};

const decrypt = async (encryptedText:string, token:string) => {
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');

  // Extract salt, iv, and the actual encrypted text
  const salt = encryptedBuffer.slice(0, 16);
  const iv = encryptedBuffer.slice(16, 32);
  const text = encryptedBuffer.slice(32);

  // Derive the key using the salt and token
  const key = (await scryptAsync(token, salt, 32)) as Buffer;

  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  const decryptedText = Buffer.concat([
    decipher.update(text),
    decipher.final(),
  ]);

  return decryptedText.toString('utf8');
};

export { encrypt, decrypt };