import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import { connect } from './utils/connect';
import { routes } from './routes';
import { deserializeUser } from './middleware/deserializeUser';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { logger } from './utils/logger';
import { Error } from 'mongoose';

// Config
const port = config.get<number>('port');

// App
const app = express();

app.use(express.json());

// Use middleware
app.use(deserializeUser);
// app.use(loggerMiddleware);

// Debugging
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});


app.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);

  // Connecting to DB
  await connect();

  // Calling routes
  routes(app);
});
