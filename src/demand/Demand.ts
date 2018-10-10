import { Car } from '../car'
import { Location } from '../location'

export type Demand = {
    userId: string

    pickUpLocation: Location
    dropOffLocation: Location
    earliestPickUpDate: Date
    latestDropOffDate: Date

    desiredCarFeatures: Partial<Car>
}
