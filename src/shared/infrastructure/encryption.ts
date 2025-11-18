import CryptoJS from 'crypto-js';

import { env } from '@/core/config/env';
import { logger } from './logger/pino.logger';

/**
 * Encryption utility for sensitive data (credentials, secrets, etc.)
 * Uses AES-256-CBC encryption with a secure key
 */

/**
 * Encrypt a string value
 * @param value - The plain text value to encrypt
 * @returns Encrypted string (Base64 encoded)
 * @throws Error if encryption fails
 */
export function encrypt(value: string): string {
  try {
    if (!value) {
      throw new Error('Cannot encrypt empty value');
    }

    // Use AES encryption with the secret key
    const encrypted = CryptoJS.AES.encrypt(value, env.ENCRYPTION_KEY).toString();

    logger.debug({ hasValue: !!value, resultLength: encrypted.length }, 'Encrypted value');

    return encrypted;
  } catch (error) {
    logger.error({ error }, 'Failed to encrypt value');
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt an encrypted string
 * @param encryptedValue - The encrypted value (Base64 encoded)
 * @returns Decrypted plain text value
 * @throws Error if decryption fails
 */
export function decrypt(encryptedValue: string): string {
  try {
    if (!encryptedValue) {
      throw new Error('Cannot decrypt empty value');
    }

    // Decrypt using the same secret key
    const bytes = CryptoJS.AES.decrypt(encryptedValue, env.ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption resulted in empty value');
    }

    logger.debug({ hasValue: !!decrypted }, 'Decrypted value');

    return decrypted;
  } catch (error) {
    logger.error({ error }, 'Failed to decrypt value');
    throw new Error('Decryption failed');
  }
}

/**
 * Encrypt an object (converts to JSON first)
 * @param obj - The object to encrypt
 * @returns Encrypted string
 */
export function encryptObject<T extends Record<string, unknown>>(obj: T): string {
  try {
    const jsonString = JSON.stringify(obj);
    return encrypt(jsonString);
  } catch (error) {
    logger.error({ error }, 'Failed to encrypt object');
    throw new Error('Object encryption failed');
  }
}

/**
 * Decrypt and parse an encrypted object
 * @param encryptedValue - The encrypted object string
 * @returns Decrypted and parsed object
 */
export function decryptObject<T extends Record<string, unknown>>(encryptedValue: string): T {
  try {
    const decrypted = decrypt(encryptedValue);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    logger.error({ error }, 'Failed to decrypt object');
    throw new Error('Object decryption failed');
  }
}

/**
 * Hash a value using SHA-256 (one-way, for passwords/tokens)
 * @param value - The value to hash
 * @returns SHA-256 hash (hex string)
 */
export function hash(value: string): string {
  if (!value) {
    throw new Error('Cannot hash empty value');
  }
  return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
}

/**
 * Compare a plain value with its hash
 * @param value - Plain text value
 * @param hashedValue - Hashed value to compare against
 * @returns true if they match, false otherwise
 */
export function verifyHash(value: string, hashedValue: string): boolean {
  const computedHash = hash(value);
  return computedHash === hashedValue;
}

/**
 * Generate a random token (for API keys, webhook URLs, etc.)
 * @param length - Length of the token (default: 32)
 * @returns Random hex string
 */
export function generateToken(length = 32): string {
  return CryptoJS.lib.WordArray.random(length / 2).toString(CryptoJS.enc.Hex);
}
