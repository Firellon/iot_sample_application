import * as Router from 'koa-router'
import { IRouterContext } from 'koa-router'
import { injectable, inject } from 'inversify'

import { Car } from './Car'
import { ICarRepository } from './CarRepository'
import { ILogger, ILoggerFactory } from '../logging'
import { IRouter } from '../core'
import { Location, ILocationRepository } from '../location'
import { TYPES } from '../inversify.types'

@injectable()
export class CarRouter implements IRouter {
    public readonly router: Router
    private readonly logger: ILogger

    // prettier-ignore
    constructor(
        @inject(TYPES.LoggerFactory) loggerFactory: ILoggerFactory,
        @inject(TYPES.CarRepository) private carRepository: ICarRepository,
        @inject(TYPES.LocationRepository) private locationRepository: ILocationRepository
    ) {
        this.logger = loggerFactory.create(`CarRouter`)
        this.router = new Router({
            prefix: '/cars',
        })

        this.router.get('/', this.getCars)
        this.router.get('/:id', this.getCarById)

        this.router.post('/', this.createCar)

        this.router.put('/:id', this.updateCar)
        this.router.put('/:id/location', this.updateCarLocation)

        this.router.delete('/:id', this.removeCar)
    }

    private getCars = (context: IRouterContext) => {
        this.logger.info(`getCars`)
        const cars = this.carRepository.findAll()
        context.body = {
            cars
        }
        context.status = 200
    }

    private getCarById = (context: IRouterContext) => {
        const id = context.query.id
        const car = this.carRepository.findById(id)
        if (!car) {
            context.body = {
                message: `Car ${id} not found`
            }
            context.status = 404
            return
        }
        context.body = {
            car
        }
        context.status = 200
    }

    private createCar = (context: IRouterContext) => {
        const car: Car = context.body
        const newCar = this.carRepository.insertOne(car)
        context.body = {
            car: newCar
        }
        context.status = 201
    }

    private updateCar = (context: IRouterContext) => {
        const id = context.query.id
        const car: Partial<Car> = context.body
        const updatedCar = this.carRepository.updateById(id, car)
        context.body = {
            car: updatedCar
        }
        context.status = 200
    }

    private updateCarLocation = (context: IRouterContext) => {
        const carId = context.query.id
        const location: Partial<Location> = context.body
        const car = this.carRepository.findById(carId)
        if (!car) {
            context.status = 404
            return
        }
        const updatedLocation = this.locationRepository.updateById(car.locationId, location)
        context.body = {
            location: updatedLocation
        }
        context.status = 200
    }

    private removeCar = (context: IRouterContext) => {
        const id = context.query.id
        const car = this.carRepository.findById(id)
        if (!car) {
            context.body = {
                message: `Car ${id} not found`
            }
            context.status = 404
            return
        }
        this.carRepository.deleteById(id)
        context.status = 200
    }
}
