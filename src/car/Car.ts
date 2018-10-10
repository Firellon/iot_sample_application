export interface Car {
    id: string
    locationId: string

    model: string
    engine: string
    infotainmentSystem: string
    interiorDesign: string
}

export const generateCar = (props: Partial<Car> = {}): Car =>  {
    return Object.assign({
        id: '',
        locationId: '',

        model: '',
        engine: '',
        infotainmentSystem: '',
        interiorDesign: ''
    }, props)
}