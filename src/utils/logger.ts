import pino from 'pino';
import expressPino from 'express-pino-logger';

declare type LogLevels = 'warn' | 'error' | 'info' | 'debug';
export const logLevel: LogLevels = (process.env.LOG_LEVEL ||
  'warn') as LogLevels;

let transport;

if (process.env.NODE_ENV === 'development') {
  transport = pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  });
}

const logger = pino({ level: logLevel }, transport);

export const expressLogger = expressPino({
  logger,
  level: logLevel,
  autoLogging: {
    ignorePaths: ['/health', '/api/health'],
  },
});

export default logger;
