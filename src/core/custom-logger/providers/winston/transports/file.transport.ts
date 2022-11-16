import ecsFormat from "@elastic/ecs-winston-format";
import path from "path";
import winston from "winston";

export function fileTransport() {
  return new winston.transports.File({
    format: ecsFormat(),
    dirname: path.join(process.cwd(), "logs"),
    filename: "combined.log",
    level: "info"
  });
}
