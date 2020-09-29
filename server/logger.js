const { createLogger, format, transports, config } = require("winston");
const fs = require("fs");
const path = require("path");
const logDir = "log";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const filename = path.join(logDir,"centralize.log");

const myFormatter = format((info) => {
    const {message} = info;
  
    if (info.data) {
      info.message = `${message} ${JSON.stringify(info.data)}`;
      delete info.data; // We added `data` to the message so we can delete it
    }
    
    return info;
  })();

const logger = createLogger({
    // change level if in dev environment versus production
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.json()
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename}),
    ],
  });

module.exports = logger