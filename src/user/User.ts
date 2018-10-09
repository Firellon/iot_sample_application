export type User = {
    id: string
    name: string
    gender: Gender
    // Generally preferable to store birth date instead
    age: number
}

export type Gender = 'male' | 'female'