import moment from "moment";
import winston from "winston";

export function consoleTransport() {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.cli({
        colors: {
          error: "red",
          warn: "yellow",
          info: "blue",
          http: "green",
          verbose: "cyan",
          debug: "white"
        }
      }),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `[${info["service.name"]}] ${process.pid}  - ${moment(
          info.timestamp
        ).format("DD.MM.YYYY, HH:mm:ss")}\t ${info.level}: ${(
          info.message as string
        )?.trim()}`;
      })
    ),
    handleExceptions: true
  });
}
