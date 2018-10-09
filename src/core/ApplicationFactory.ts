import { inject, injectable } from 'inversify'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { TYPES } from '../inversify.types'
import { IRouter } from './IRouter'
import { ILogger, ILoggerFactory, LoggerFactory } from '../logging'

export interface IApplicationFactory {
    create(): Koa
}

@injectable()
export class ApplicationFactory implements IApplicationFactory {
    private logger: ILogger
    constructor(
        @inject(TYPES.LoggerFactory) loggerFactory: ILoggerFactory,
        @inject(TYPES.CarRouter) private carRouter: IRouter
    ) {
        this.logger = loggerFactory.create('ApplicationFactory')
    }

    public create(): Koa {
        const app: Koa = new Koa()

        app.use(bodyParser())

        app.use(async (context, next) => {
            this.logger.debug(
                `Request (${context.url}), headers: ${JSON.stringify(context.headers)}, from: ${context.origin}`
            )
            this.logger.info(`Application received request on ${context.url} from ${context.origin}`)
        })

        // Endpoints
        app.use(this.carRouter.router.routes())

        return app
    }
}
