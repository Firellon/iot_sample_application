import * as Koa from 'koa'
import { Server } from 'net'

import { IApplicationFactory } from './core/ApplicationFactory'
import { ContainerFactory } from './core/ContainerFactory'
import { TYPES } from './inversify.types'
import { LoggerFactory, ILogger } from './logging'

let server: Server
// TODO: use ENV var for log level and app name
let logger: ILogger = new LoggerFactory('info').create('IotApplication')
export const bootApi = async (): Promise<Server> => {
    const containerFactory = new ContainerFactory()
    const container = containerFactory.createApiContainer()
    const app: Koa = container.get<IApplicationFactory>(TYPES.ApplicationFactory).create()
    // TODO: use ENV var for port number
    const port = 4000

    try {
        server = app.listen(port, () => logger.info(`Listening on port ${port}...`))
    } catch (err) {
        logger.error(err.stack)
        if (server) {
            await server.close()
        }
    }

    return server
}
