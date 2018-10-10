export const COMMON_TYPES = {
    ApplicationFactory: Symbol('ApplicationFactory'),
    DefaultRepository: Symbol('DefaultRepository'),
    DefaultRepositoryFactory: Symbol('DefaultRepositoryFactory'),
    IdGenerator: Symbol('IdGenerator'),
    Logger: Symbol('Logger'),
    LoggerFactory: Symbol('LoggerFactory')
}

export const CAR_TYPES = {
    CarRouter: Symbol('CarRouter'),
    CarRepository: Symbol('CarRepository')
}

export const LOCATION_TYPES = {
    LocationRepository: Symbol('LocationRepository')
}

export const USER_TYPES = {}

export const DEMAND_TYPES = {}

export const TYPES = {
    ...COMMON_TYPES,
    ...CAR_TYPES,
    ...LOCATION_TYPES,
    ...USER_TYPES,
    ...DEMAND_TYPES
}
