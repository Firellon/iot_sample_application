export const COMMON_TYPES = {
    ApplicationFactory: Symbol("ApplicationFactory"),
    DefaultRepository: Symbol("DefaultRepository"),
    DefaultRepositoryFactory: Symbol("DefaultRepositoryFactory"),
    IdGenerator: Symbol("IdGenerator"),
    Logger: Symbol("Logger"),
    LoggerFactory: Symbol("LoggerFactory")
}

export const CAR_TYPES = {
    CarRouter: Symbol("CarRouter"),
    CarRepository: Symbol("CarRepository")
}

export const TYPES = {
    ...COMMON_TYPES,
    ...CAR_TYPES
}
