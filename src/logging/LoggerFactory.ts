import { ILogger } from './ILogger'
import { transports, Logger } from 'winston'
import { LogLevel } from './LogLevel';

export interface ILoggerFactory {
    create(prefix: string): ILogger
}
export class LoggerFactory implements ILoggerFactory {
    constructor(private logLevel: LogLevel = 'info') {}

    create(prefix: string): ILogger {
        return new Logger({
            level: this.logLevel,
            colors: {
                debug: 'blue',
                info: 'green',
                warn: 'yellow',
                error: 'red',
            },
            transports: [
                new transports.Console({
                    level: this.logLevel,
                    prettyPrint: true,
                    colorize: true,
                    silent: false,
                    timestamp: false,
                }),
            ],
            filters: [
                (level, msg, meta) => ({
                    meta,
                    level,
                    msg: `${prefix} - ${msg}`,
                }),
            ],
        })
    }
}
