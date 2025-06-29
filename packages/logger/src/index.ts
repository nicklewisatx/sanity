import winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const logDirectory = process.env.LOG_DIR || 'logs';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      )
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  }),
];

if (isProduction || process.env.ENABLE_FILE_LOGS === 'true') {
  transports.push(
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.json(),
    }),
    new winston.transports.DailyRotateFile({
      filename: join(logDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.json(),
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  levels,
  format,
  transports,
  exitOnError: false,
});

export default logger;

export const createChildLogger = (service: string) => {
  return logger.child({ service });
};

export type Logger = typeof logger;