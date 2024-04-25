const winston = require("winston");

require("winston-daily-rotate-file");

const env = require("#root/src/config/env.cjs");

const loggerFormat = winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint());
const loggerTransportDatePattern = "YYYY-MM-DD";

const generalLogTransport = new winston.transports.DailyRotateFile({
  filename: `${env.APPLICATION_NAME}-general-%DATE%.log`,
  dirname: "src/log/general",
  datePattern: loggerTransportDatePattern,
  level: "info",
});

const errorLogTransport = new winston.transports.DailyRotateFile({
  filename: `${env.APPLICATION_NAME}-error-%DATE%.log`,
  dirname: "src/log/error",
  datePattern: loggerTransportDatePattern,
  level: "error",
});

const logger = winston.createLogger({
  format: loggerFormat,
  defaultMeta: { app: env.APPLICATION_NAME },
  transports: [generalLogTransport, errorLogTransport],
});

if (env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: loggerFormat }));
}

module.exports = logger;
