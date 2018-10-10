import { injectable } from 'inversify'
import _ = require('lodash')

import { Maybe } from './Maybe'
import { WithId } from './WithId'

export interface IDefaultRepository<T extends WithId> {
    findAll(): T[]
    findById(id: string): Maybe<T>
    insertOne(entity: T): T
    updateById(id: string, entityUpdate: Partial<T>): T
    deleteById(id: string): void
}

@injectable()
export class DefaultRepository<T extends WithId> implements IDefaultRepository<T> {
    private db: Map<string, T> = new Map()
    private idCounter = 0

    constructor(private name: string) {}

    private getNextId(): string {
        this.idCounter++
        return this.idCounter.toString()
    }

    findAll(): T[] {
        return Array.from(this.db.values())
    }

    findById(id: string): Maybe<T> {
        return this.db.get(id)
    }

    insertOne(entity: T): T {
        const newId = this.getNextId()
        entity.id = newId
        this.db.set(newId, entity)
        return entity
    }

    updateById(id: string, entityUpdate: Partial<T>): T {
        const existingEntity = this.findById(id)
        if (!existingEntity) {
            throw new Error(`${this.name} ${id} not found`)
        }
        const updatedEntity = _.merge(existingEntity, entityUpdate, { id })
        this.db.set(id, updatedEntity)
        return updatedEntity
    }

    deleteById(id: string): void {
        const existingEntity = this.findById(id)
        if (!existingEntity) {
            throw new Error(`${this.name} ${id} not found`)
        }
        this.db.delete(id)
    }
}
