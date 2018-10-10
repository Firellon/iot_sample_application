import { injectable, inject } from 'inversify'
import _ = require('lodash')

import { Car } from './Car'
import { TYPES } from '../inversify.types'
import { DefaultRepository, IDefaultRepository } from '../core/DefaultRepository'
import { WithId, Maybe } from '../core'

export interface ICarRepository extends IDefaultRepository<Car> {}

@injectable()
export class CarRepository implements ICarRepository {
    private defaultRepository: DefaultRepository<Car>

    constructor(
        @inject(TYPES.DefaultRepositoryFactory)
        defaultRepositoryFactory: <T extends WithId>(name: string) => DefaultRepository<T>
    ) {
        this.defaultRepository = defaultRepositoryFactory<Car>('Car')
    }

    findAll(): Car[] {
        return this.defaultRepository.findAll()
    }

    findById(id: string): Maybe<Car> {
        return this.defaultRepository.findById(id)
    }

    insertOne(car: Car): Car {
        return this.defaultRepository.insertOne(car)
    }

    updateById(id: string, carUpdate: Partial<Car>): Car {
        return this.defaultRepository.updateById(id, carUpdate)
    }

    deleteById(id: string): void {
        return this.defaultRepository.deleteById(id)
    }
}
