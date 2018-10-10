import 'reflect-metadata'

import { Container, interfaces } from 'inversify'
import { Logger, createLogger, LoggerOptions } from 'winston'

import { ApplicationFactory, IApplicationFactory } from './ApplicationFactory'
import { CarRepository } from '../car'
import { CarRouter } from '../car/CarRouter'
import { LoggerFactory } from '../logging'
import { TYPES } from '../inversify.types'
import { DefaultRepository } from './DefaultRepository'
import { WithId } from './WithId'
import { LocationRepository, ILocationRepository } from '../location';

export interface IContainerFactory {
    createApiContainer(): Container
}

export class ContainerFactory implements IContainerFactory {
    private logger: Logger

    constructor() {
        // TODO: use ENV var for log level
        this.logger = new LoggerFactory('info').create('ContainerFactory')
    }

    public createApiContainer(): Container {
        const container = new Container()

        this.bindLoggingModules(container)
        this.bindCarModules(container)
        this.bindLocationModules(container)
        this.bindUserModules(container)
        this.bindDemandModules(container)
        this.bindCoreModules(container)

        this.logger.info('createApiContainer > successfully finished')
        return container
    }

    private bindLoggingModules(container: Container) {
        container.bind(TYPES.Logger).toConstantValue(this.logger)
        container.bind(TYPES.LoggerFactory).toDynamicValue(() => {
            return new LoggerFactory('info')
        })
    }

    private bindCarModules(container: Container) {
        container
            .bind(TYPES.CarRepository)
            .to(CarRepository)
            .inSingletonScope()
        container
            .bind(TYPES.CarRouter)
            .to(CarRouter)
            .inSingletonScope()
    }

    private bindLocationModules(container: Container) {
        container
            .bind<ILocationRepository>(TYPES.LocationRepository)
            .to(LocationRepository)
            .inSingletonScope()
    }

    private bindUserModules(container: Container) {}

    private bindDemandModules(container: Container) {}

    private bindCoreModules(container: Container) {
        container
            .bind<interfaces.Factory<DefaultRepository<any>>>(TYPES.DefaultRepositoryFactory)
            .toFactory<DefaultRepository<any>>(() => {
                return <T extends WithId>(name: string) => new DefaultRepository<T>(name)
            })
        container
            .bind<IApplicationFactory>(TYPES.ApplicationFactory)
            .to(ApplicationFactory)
            .inSingletonScope()
    }
}
