import { isa } from './isa'
import { nota } from './nota'

export const isaNumber = isa<number>(thing => typeof thing === 'number')
export const notaNumber = nota<number>(isaNumber)
