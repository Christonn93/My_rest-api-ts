import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';
import { logger } from '../utils/logger';

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  // Retrieve access token and refresh token from headers
  const accessToken = req.header('Authorization')?.replace(`Bearer `, '');
  const refreshToken = req.header('x-refresh');

  logger.info(`Attempting to deserialize user. Access token: ${accessToken}, Refresh token: ${refreshToken}`);

  if (!accessToken) {
    logger.warn('No access token found, proceeding to next middleware.');
    return next();
  }

  // Verify the access token
  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    logger.info(`Access token verified successfully. User ID: ${(decoded as any)._id}`);
    res.locals.user = decoded;
    return next();
  }

  if (expired) {
    logger.warn('Access token expired.');
  } else {
    logger.error('Access token verification failed due to malformed token or other error.');
  }

  if (expired && refreshToken) {
    logger.info('Access token expired, attempting to reissue using refresh token.');

    const token = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken;
    const newAccessToken = await reIssueAccessToken({ refreshToken: token });

    if (newAccessToken) {
      logger.info('New access token successfully reissued. Setting x-access-token header.');
      res.setHeader('x-access-token', newAccessToken);
    } else {
      logger.warn('Failed to reissue access token with provided refresh token.');
    }

    const result = verifyJwt(newAccessToken as string);

    if (result.decoded) {
      logger.info(`Reissued access token verified successfully. User ID: ${(result.decoded as any)._id}`);
      res.locals.user = result.decoded;
    } else {
      logger.error('Reissued access token verification failed.');
    }
  } else {
    logger.warn('No valid access or refresh token available to authenticate user.');
  }

  return next();
};
