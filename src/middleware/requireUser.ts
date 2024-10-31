import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requireUser = (req: Request, res: Response, next: NextFunction): void => {
  const user = res.locals.user;

  if (!user) {
    logger.debug(`No user found, this is what i found ${user}`);
    res.sendStatus(403);
    return;
  }

  next();
};
