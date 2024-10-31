import dayjs from 'dayjs';
import pino from 'pino';

// Create the base logger
export const baseLogger = pino(
  {
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: true,
      },
    },
  }
);

// Function to extract file and line number from the stack trace
const getCallerInfo = () => {
  const err = new Error();
  const stack = err.stack?.split('\n');

  if (!stack || stack.length < 4) return 'unknown line: unknown';

  const callerLine = stack[4];
  const regex = /at\s+.*\s+\((.*?):(\d+):\d+\)/;

  const match = callerLine.match(regex);
  if (match) {
    let filePath = match[1];
    const lineNumber = match[2];

    const pathSegments = filePath.split('\\');
    const shortPath = pathSegments.slice(-2).join('/');

    return `file: /${shortPath} - line: ${lineNumber}`;
  }

  return 'unknown line: unknown';
};

// Custom logger that includes file path and line number
export const logger = {
  info: (msg: string) => baseLogger.info(`${msg} '${getCallerInfo()}'`),
  error: (msg: string) => baseLogger.error(`${msg} '${getCallerInfo()}'`),
  warn: (msg: string) => baseLogger.warn(`${msg} '${getCallerInfo()}'`),
  debug: (msg: string) => baseLogger.debug(`${msg} '${getCallerInfo()}'`),
};

