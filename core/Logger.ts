import winston from 'winston';

const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, label, message }) => `${timestamp} [${level.toUpperCase()}] [${label}] ${message}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});

export class Logger {
  private readonly logger: winston.Logger;

  constructor(label = 'test') {
    this.logger = baseLogger.child({ label });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }
}
