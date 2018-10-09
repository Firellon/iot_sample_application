import { Car } from "../car/Car";
import { Location } from "../location/Location";

export type Demand = {
    userId: string;

    pickUpLocation: Location;
    dropOffLocation: Location;
    earliestPickUpDate: Date;
    latestDropOffDate: Date;

    desiredCarFeatures: Partial<Car>;
};
