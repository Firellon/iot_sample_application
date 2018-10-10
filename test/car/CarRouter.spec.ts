import { Server } from 'net'
import * as chai from 'chai'
import ChaiHttp = require('chai-http')

chai.use(ChaiHttp)

import { ContainerFactory } from '../../src/core/ContainerFactory'
import { IApplicationFactory } from '../../src/core/ApplicationFactory'
import { TYPES } from '../../src/inversify.types'
import { Car, generateCar } from '../../src/car/Car'
import { ICarRepository } from '../../src/car/CarRepository'

describe('CarRouter', () => {
    let server: Server
    let agent: ChaiHttp.Agent
    let repository: ICarRepository

    beforeAll(async () => {
        const container = new ContainerFactory().createApiContainer()
        const app = container.get<IApplicationFactory>(TYPES.ApplicationFactory).create()
        server = app.listen(5000)

        repository = container.get<ICarRepository>(TYPES.CarRepository)
    })

    beforeEach(async () => {
        agent = chai.request(server)

        await repository.clear()
    })

    describe('GET /cars/', () => {
        it('finds all cars', async () => {
            const dbCars: Car[] = [generateCar(), generateCar(), generateCar()]
            await repository.insertMany(dbCars)

            const response = await agent
                .get(`/cars`)
                .query({})
                .send({})

            expect(response.status).toBe(200)
            const json = response.body
            expect(json).toBeTruthy()
            const { cars } = json
            expect(cars).toBeInstanceOf(Array)
            expect(cars).toHaveLength(dbCars.length)
        })
    })
})
