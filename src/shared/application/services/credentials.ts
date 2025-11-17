import type { CredentialType } from '@/prisma/generated/prisma/enums';

import { decryptObject, encryptObject } from '../../infrastructure/encryption';
import { logger } from '../../infrastructure/logger/logger';

/**
 * Credential type from Prisma (using generated types)
 */
export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  data: string; // encrypted
  isActive: boolean;
  lastUsedAt: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Credential management utilities
 * Handles encryption/decryption of sensitive credential data
 */

export interface CredentialData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ApiKeyCredential extends CredentialData {
  apiKey: string;
  apiKeyHeader?: string; // Optional header name (default: Authorization)
}

export interface OAuth2Credential extends CredentialData {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string;
}

export interface BasicAuthCredential extends CredentialData {
  username: string;
  password: string;
}

export interface BearerTokenCredential extends CredentialData {
  token: string;
}

export interface AwsCredential extends CredentialData {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
}

export interface SshKeyCredential extends CredentialData {
  host: string;
  port: number;
  username: string;
  privateKey: string;
  passphrase?: string;
}

/**
 * Encrypt credential data before storing in database
 * @param data - Plain credential data object
 * @returns Encrypted string safe to store in DB
 */
export function encryptCredential(data: CredentialData): string {
  try {
    logger.debug({ dataKeys: Object.keys(data) }, 'Encrypting credential data');
    return encryptObject(data);
  } catch (error) {
    logger.error({ error }, 'Failed to encrypt credential');
    throw new Error('Credential encryption failed');
  }
}

/**
 * Decrypt credential data from database
 * @param encryptedData - Encrypted credential string from DB
 * @returns Decrypted credential data object
 */
export function decryptCredential<T extends CredentialData = CredentialData>(
  encryptedData: string
): T {
  try {
    logger.debug('Decrypting credential data');
    return decryptObject<T>(encryptedData);
  } catch (error) {
    logger.error({ error }, 'Failed to decrypt credential');
    throw new Error('Credential decryption failed');
  }
}

/**
 * Validate credential data based on type
 * @param type - The credential type
 * @param data - The credential data to validate
 * @returns true if valid, throws error if invalid
 */
export function validateCredentialData(type: CredentialType, data: CredentialData): boolean {
  switch (type) {
    case 'API_KEY':
      if (!data.apiKey || typeof data.apiKey !== 'string') {
        throw new Error('API_KEY credential requires apiKey field');
      }
      break;

    case 'OAUTH2':
      if (
        !data.clientId ||
        !data.clientSecret ||
        !data.accessToken ||
        typeof data.clientId !== 'string' ||
        typeof data.clientSecret !== 'string' ||
        typeof data.accessToken !== 'string'
      ) {
        throw new Error(
          'OAUTH2 credential requires clientId, clientSecret, and accessToken fields'
        );
      }
      break;

    case 'BASIC_AUTH':
      if (
        !data.username ||
        !data.password ||
        typeof data.username !== 'string' ||
        typeof data.password !== 'string'
      ) {
        throw new Error('BASIC_AUTH credential requires username and password fields');
      }
      break;

    case 'BEARER_TOKEN':
      if (!data.token || typeof data.token !== 'string') {
        throw new Error('BEARER_TOKEN credential requires token field');
      }
      break;

    case 'AWS_CREDENTIALS':
      if (
        !data.accessKeyId ||
        !data.secretAccessKey ||
        !data.region ||
        typeof data.accessKeyId !== 'string' ||
        typeof data.secretAccessKey !== 'string' ||
        typeof data.region !== 'string'
      ) {
        throw new Error('AWS_CREDENTIALS requires accessKeyId, secretAccessKey, and region fields');
      }
      break;

    case 'SSH_KEY':
      if (
        !data.host ||
        !data.username ||
        !data.privateKey ||
        typeof data.host !== 'string' ||
        typeof data.username !== 'string' ||
        typeof data.privateKey !== 'string'
      ) {
        throw new Error('SSH_KEY credential requires host, username, and privateKey fields');
      }
      break;

    default:
      throw new Error(`Unknown credential type: ${type}`);
  }

  return true;
}

/**
 * Mask sensitive fields in credential data for logging
 * @param data - Credential data
 * @returns Masked credential data safe for logging
 */
export function maskCredentialData(data: CredentialData): CredentialData {
  const masked: CredentialData = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Mask sensitive fields
      const sensitiveFields = [
        'apiKey',
        'token',
        'password',
        'secret',
        'privateKey',
        'accessToken',
        'refreshToken',
      ];

      if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
        masked[key] =
          value.length > 4 ? `${value.slice(0, 4)}${'*'.repeat(value.length - 4)}` : '****';
      } else {
        masked[key] = value;
      }
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Prepare credential data for use in HTTP requests
 * @param credential - The credential from database
 * @returns Decrypted credential data with helper methods
 */
export function prepareCredentialForRequest(credential: Credential) {
  const data = decryptCredential(credential.data);

  return {
    id: credential.id,
    name: credential.name,
    type: credential.type,
    data,

    /**
     * Get authorization header value based on credential type
     */
    getAuthHeader(): { [key: string]: string } {
      switch (credential.type) {
        case 'API_KEY': {
          const apiKeyData = data as ApiKeyCredential;
          const headerName = apiKeyData.apiKeyHeader || 'Authorization';
          return { [headerName]: `Bearer ${apiKeyData.apiKey}` };
        }

        case 'BEARER_TOKEN': {
          const tokenData = data as BearerTokenCredential;
          return { Authorization: `Bearer ${tokenData.token}` };
        }

        case 'BASIC_AUTH': {
          const basicData = data as BasicAuthCredential;
          const encoded = Buffer.from(`${basicData.username}:${basicData.password}`).toString(
            'base64'
          );
          return { Authorization: `Basic ${encoded}` };
        }

        case 'OAUTH2': {
          const oauthData = data as OAuth2Credential;
          return { Authorization: `Bearer ${oauthData.accessToken}` };
        }

        default:
          return {};
      }
    },
  };
}
