import { Express, Request, Response } from 'express';

import { createUserHandler } from './controller/user.controller';
import { createUserSchema } from './schema/user.schema';

import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controller/session.controller';
import { createSessionSchema } from './schema/session.schema';

import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from './schema/product.schema';
import { createProductHandler, getProductHandler, updateProductHandler } from './controller/product.controller';

import { validateResource } from './middleware/validateRecourse';
import { requireUser } from './middleware/requireUser';
import { logger } from './utils/logger';

export function routes(app: Express) {
  app.get('/healthCheck', (req: Request, res: Response) => {
    const status = res.sendStatus(200);
    logger.info(`${status}`);
  });

  app.post('/api/users', validateResource(createUserSchema), createUserHandler);

  // Session
  app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler);
  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  // Products
  app.post('/api/products', [requireUser, validateResource(createProductSchema)], createProductHandler);

  app.put('/api/products/:productId', [requireUser, validateResource(updateProductSchema)], updateProductHandler);

  app.get('/api/products/:productId', validateResource(getProductSchema), getProductHandler);

  app.delete('/api/products/:productId', [requireUser, validateResource(deleteProductSchema)], getProductHandler);
}
