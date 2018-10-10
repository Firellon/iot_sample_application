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
    let dbCars: Car[] = [
        generateCar({
            id: 'C-1'
        }),
        generateCar({
            id: 'C-2'
        }),
        generateCar({
            id: 'C-3'
        })
    ]

    beforeAll(async () => {
        const container = new ContainerFactory().createApiContainer()
        const app = container.get<IApplicationFactory>(TYPES.ApplicationFactory).create()
        server = app.listen(5000)

        repository = container.get<ICarRepository>(TYPES.CarRepository)
    })

    beforeEach(() => {
        agent = chai.request(server)

        dbCars = repository.insertMany(dbCars)
    })

    afterEach(async () => {
        await repository.clear()
    })

    describe('GET /cars/', () => {
        it('finds all cars', async () => {
            const response = await agent.get(`/cars`)

            expect(response.status).toBe(200)
            const json = response.body
            expect(json).toBeTruthy()
            const { cars } = json
            expect(cars).toBeInstanceOf(Array)
            expect(cars).toHaveLength(dbCars.length)
        })
    })

    describe('GET /cars/:id', () => {
        it('finds car by id', async () => {
            const expectedCar = dbCars[0]
            const response = await agent.get(`/cars/${expectedCar.id}`)

            expect(response.status).toBe(200)
            const json = response.body
            expect(json).toBeTruthy()
            const { car } = json
            expect(car).toEqual(expectedCar)
        })
    })

    describe('POST /cars', () => {
        it('creates a new car', async () => {
            const carCreate: Partial<Car> = {
                model: 'Model-1',
                engine: 'Engine-1',
                infotainmentSystem: 'IS',
                interiorDesign: 'beige'
            }
            const response = await agent
                .post(`/cars`)
                .query({})
                .send(carCreate)

            expect(response.status).toBe(201)
            const json = response.body
            expect(json).toBeTruthy()
            const createdCar = json.car
            expect(createdCar).toBeTruthy()
            const existingCar = repository.findById(createdCar.id)
            expect(existingCar).toBeTruthy()
            if (existingCar) {
                expect(existingCar.model).toEqual(carCreate.model)
                expect(existingCar.engine).toEqual(carCreate.engine)
                expect(existingCar.infotainmentSystem).toEqual(carCreate.infotainmentSystem)
                expect(existingCar.interiorDesign).toEqual(carCreate.interiorDesign)
            }
        })
    })

    describe('PUT /cars/:id', () => {
        it('updates car by id', async () => {
            const updatedCar = dbCars[0]
            const carUpdate: Partial<Car> = {
                model: 'Model-Updated',
                engine: 'Engine-Updated',
                infotainmentSystem: 'IS-Updated',
                interiorDesign: 'blue'
            }
            const response = await agent
                .put(`/cars/${updatedCar.id}`)
                .query({})
                .send(carUpdate)

            expect(response.status).toBe(200)
            const json = response.body
            expect(json).toBeTruthy()
            const car = repository.findById(updatedCar.id)
            expect(car).toBeTruthy()
            if (car) {
                expect(car.model).toEqual(carUpdate.model)
                expect(car.engine).toEqual(carUpdate.engine)
                expect(car.infotainmentSystem).toEqual(carUpdate.infotainmentSystem)
                expect(car.interiorDesign).toEqual(carUpdate.interiorDesign)
            }
        })
    })

    describe('DELETE /cars/:id', () => {
        it('deletes car by id', async () => {
            const deletedCar = dbCars[1]
            const response = await agent.del(`/cars/${deletedCar.id}`)

            expect(response.status).toBe(200)
            const json = response.body
            expect(json).toBeTruthy()
            const car = repository.findById(deletedCar.id)
            expect(car).toBeUndefined()
        })
    })
})
