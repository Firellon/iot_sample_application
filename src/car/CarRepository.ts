import { injectable } from 'inversify'

import { Car } from './Car'
import { Maybe } from '../core/Maybe'
import _ = require('lodash')

export interface ICarRepository {
    findAll(): Car[]
    findById(id: string): Maybe<Car>
    insertOne(car: Car): Car
    updateOne(id: string, car: Partial<Car>): Car
    deleteOne(id: string): void
}

@injectable()
export class CarRepository implements ICarRepository {
    private db: Map<string, Car> = new Map()
    private idCounter = 0

    private getNextId(): string {
        this.idCounter++
        return this.idCounter.toString()
    }

    findAll(): Car[] {
        return Array.from(this.db.values())
    }

    findById(id: string): Maybe<Car> {
        return this.db.get(id)
    }

    insertOne(car: Car): Car {
        const newId = this.getNextId()
        car.id = newId
        this.db.set(newId, car)
        return car
    }

    updateOne(id: string, carUpdate: Partial<Car>): Car {
        const existingCar = this.findById(id)
        if (!existingCar) {
            throw new Error(`Car ${id} not found`)
        }
        const car = _.merge(existingCar, carUpdate, { id })
        this.db.set(id, car)
        return car
    }

    deleteOne(id: string): void {
        const existingCar = this.findById(id)
        if (!existingCar) {
            throw new Error(`Car ${id} not found`)
        }
        this.db.delete(id)
    }
}
