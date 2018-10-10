import * as winston from 'winston'

import { ILogger } from './ILogger'
import { LogLevel } from './LogLevel'

export interface ILoggerFactory {
    create(prefix: string): ILogger
}
export class LoggerFactory implements ILoggerFactory {
    constructor(private logLevel: LogLevel = 'info') {}

    create(prefix: string): ILogger {
        return new winston.Logger({
            level: this.logLevel,
            colors: {
                debug: 'blue',
                info: 'green',
                warn: 'yellow',
                error: 'red'
            },
            transports: [
                new winston.transports.Console({
                    level: this.logLevel,
                    prettyPrint: true,
                    colorize: true,
                    silent: false,
                    timestamp: false
                })
            ],
            filters: [
                (level: any, msg: string, meta: any) => ({
                    meta,
                    level,
                    msg: `${prefix} - ${msg}`
                })
            ]
        })
    }
}
