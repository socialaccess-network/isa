import { isa } from './isa'
import { nota } from './nota'

export const isaBoolean = isa<boolean>(thing => typeof thing === 'boolean')
export const notaBoolean = nota<boolean>(isaBoolean)
