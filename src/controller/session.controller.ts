import { Request, Response } from 'express';
import config from 'config';
import { createSession, findSessions, updateSession } from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt.utils';
import { logger } from '../utils/logger';
import { messages } from '../utils/messages';
import { tokenStore } from '../store/tokenStore';

export async function createUserSessionHandler(req: Request, res: Response): Promise<void> {
  try {
    const user = await validatePassword(req.body);

    if (!user) {
      logger.warn(`Invalid login attempt for email: ${req.body.email}`);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const session = await createSession(user._id, req.get('user-agent') || '');

    const accessToken = signJwt({ ...user, session: session._id }, { expiresIn: config.get<string>('accessTokenTtl') });
    const refreshToken = signJwt({ ...user, session: session._id }, { expiresIn: config.get<string>('refreshTokenTtl') });

    tokenStore.accessToken = accessToken;
    tokenStore.refreshToken = refreshToken;

    logger.info(`User session created successfully for user ID: ${user._id}`);
    res.json({
      message: messages.session.creationSuccess,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error(`Error creating user session: ${error}`);
    res.status(500).json({ message: messages.session.deletionError });
  }
}

export async function getUserSessionsHandler(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user._id;

  try {
    const sessions = await findSessions({ user: userId, valid: true });
    logger.info(`Retrieved active sessions for user ID: ${userId}`);

    const accessToken = tokenStore.accessToken;
    const refreshToken = tokenStore.refreshToken;

    res.json({
      message: messages.session.retrievalSuccess,
      data: sessions,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error(`Error retrieving sessions for user ID: ${userId}: ${error}`);
    res.status(500).json({ message: messages.session.retrievalError });
  }
}

export async function deleteSessionHandler(req: Request, res: Response): Promise<void> {
  const sessionId = res.locals.user.session;

  try {
    await updateSession({ _id: sessionId }, { valid: false });
    logger.info(`Session invalidated for session ID: ${sessionId}`);
    res.json({
      message: messages.session.deleteSuccess,
      tokens: {
        accessToken: null,
        refreshToken: null,
      },
    });
  } catch (error) {
    logger.error(`Error invalidating session for session ID: ${sessionId}: ${error}`);
    res.status(500).json({ message: messages.session.deletionError });
  }
}
