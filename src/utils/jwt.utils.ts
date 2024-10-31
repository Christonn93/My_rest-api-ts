import jwt from 'jsonwebtoken';
import config from 'config';
import { logger } from './logger';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  // Ensure signing key is present and well-formatted
  if (!privateKey) {
    logger.error(`Signing key not found for ${privateKey}`);
    throw new Error(`Signing key not found for ${privateKey}`);
  }

  try {
    return jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: 'RS256',
    });
  } catch (error) {
    logger.error(`Error signing JWT: ${error}`);
    throw new Error(`Error signing JWT: ${error}`);
  }
}

export function verifyJwt(token: string) {
  // Ensure public key is present
  if (!publicKey) {
    logger.error(`Public key not found for ${publicKey}`);
    throw new Error(`Public key not found for ${publicKey}`);
  }

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    logger.error(`JWT Verification Error: ${e.message} - Token: ${token}`);
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
