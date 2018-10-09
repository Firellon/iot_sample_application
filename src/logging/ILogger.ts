export type LogCallback = (error?: any, level?: string, msg?: string, meta?: any) => void

export interface LogMethod {
    (level: string, msg: string, callback: LogCallback): void
    (level: string, msg: string, meta: any, callback: LogCallback): void
    (level: string, msg: string, ...meta: any[]): void
}

export interface LeveledLogMethod {
    (msg: string, callback: LogCallback): void
    (msg: string, meta: any, callback: LogCallback): void
    (msg: string, ...meta: any[]): void
}

export interface ILogger {
    log: LogMethod
    silly: LeveledLogMethod
    debug: LeveledLogMethod
    verbose: LeveledLogMethod
    info: LeveledLogMethod
    warn: LeveledLogMethod
    error: LeveledLogMethod
}