import { pinoHttp } from "pino-http";
import { baseLogger } from "../utils/logger";

export const loggerMiddleware = pinoHttp({
  logger: baseLogger,
  customLogLevel: (req, res) => {
    // Example: log level can be set based on response status
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  autoLogging: true, // Automatically log requests and responses
});