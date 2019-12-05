module.exports = function consoleEvent(event, lvl, lbl) {
  const { createLogger, format, transports } = require("winston");
  const { combine, timestamp, label, printf } = format;

  const myformat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${lbl || "Nano"}] ${level}: ${message}`;
  });

  const logger = createLogger({
    format: combine(label({ label: lbl }), timestamp(), myformat),
    transports: [new transports.Console()]
  });

  logger.log({
    level: lvl || "info",
    message: event
  });
};

/*
{ 
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6 
}
*/
