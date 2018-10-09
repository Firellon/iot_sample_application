import 'reflect-metadata'

import { Container, interfaces } from 'inversify'
import { Logger, createLogger, LoggerOptions } from 'winston'

import { TYPES } from '../inversify.types'
import { ApplicationFactory, IApplicationFactory } from './ApplicationFactory'
import { LoggerFactory } from '../logging';

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
        this.bindCoreModules(container)
        this.logger.info('createApiContainer > finished')
        return container
    }

    private bindLoggingModules(container: Container) {
        container.bind(TYPES.Logger).toConstantValue(this.logger)
        container.bind(TYPES.LoggerFactory).toFactory<Logger>(() => {
            return (options?: LoggerOptions) => createLogger(options)
        })
    }

    // private bindDbModules(container: Container) {
    //     // Repositories
    //         container
    //             .bind<IdGenerator>(TYPES.IdGenerator)
    //             .to(IdGenerator)
    //             .inSingletonScope()
    //         container
    //             .bind<interfaces.Factory<DefaultRepository<any>>>(TYPES.DefaultRepositoryFactory)
    //             .toFactory<DefaultRepository<any>>((context: interfaces.Context) => {
    //                 return <T extends object>(collectionName: CollectionName) =>
    //                     new DefaultRepository<T>(
    //                         context.container.get<IdGenerator>(TYPES.IdGenerator),
    //                         collectionName
    //                     )
    //             })
    // }

    private bindCoreModules(container: Container) {
        container
            .bind<IApplicationFactory>(TYPES.ApplicationFactory)
            .to(ApplicationFactory)
            .inSingletonScope()
    }
}
