import 'dotenv/config';
import { createLogger, format, transports } from 'winston';

const { combine, colorize, label, timestamp, printf } = format;

const alignColorsAndTime = combine(
  colorize({
    all: true,
  }),
  label({
    label: '[LOGGER]',
  }),
  timestamp({
    format: 'DD/MM/YYYY HH:mm:ss',
  }),
  printf((info) => {
    info.context = info.context ? `[${info.context}] ` : '';
    return `${info.label} - ${info.timestamp} ${info.level} ${info.context}${info.message}`;
  }),
);

export const logger = createLogger({
  level: process.env.DEBUG === 'true' ? 'debug' : 'info',
  transports: [
    new transports.Console({
      format: combine(
        format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        alignColorsAndTime,
      ),
    }),
  ],
});
