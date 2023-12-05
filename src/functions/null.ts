import { isa } from './isa'
import { nota } from './nota'

export const isaNull = isa<null>(thing => thing === null)
export const notaNull = nota<null>(isaNull)
