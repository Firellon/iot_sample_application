import { injectable, inject } from 'inversify'
import _ = require('lodash')

import { Location } from './Location'
import { Maybe } from '../core/Maybe'
import { TYPES } from '../inversify.types'
import { DefaultRepository, IDefaultRepository } from '../core/DefaultRepository'
import { WithId } from '../core'

export interface ILocationRepository extends IDefaultRepository<Location> {}

@injectable()
export class LocationRepository implements ILocationRepository {
    private defaultRepository: DefaultRepository<Location>

    constructor(
        @inject(TYPES.DefaultRepositoryFactory)
        defaultRepositoryFactory: <T extends WithId>(name: string) => DefaultRepository<T>
    ) {
        this.defaultRepository = defaultRepositoryFactory<Location>('Location')
    }

    findAll(): Location[] {
        return this.defaultRepository.findAll()
    }

    findById(id: string): Maybe<Location> {
        return this.defaultRepository.findById(id)
    }

    insertOne(location: Location): Location {
        return this.defaultRepository.insertOne(location)
    }

    updateById(id: string, locationUpdate: Partial<Location>): Location {
        return this.defaultRepository.updateById(id, locationUpdate)
    }

    deleteById(id: string): void {
        return this.defaultRepository.deleteById(id)
    }
}
