import { createLogger, format, transports } from 'winston'
import moment from 'moment'
const filename = moment(new Date()).format('MM-DD-YYYY') + '.log'

export default createLogger({
  transports: [
    new transports.File({
      filename: 'logs/' + filename,
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
      ),
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions-' + filename })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections-' + filename })],
})
