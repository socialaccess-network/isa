import { nota } from './nota'
import { isa } from './isa'

export const isaUndefined = isa<undefined>(thing => thing === undefined)
export const notaUndefined = nota<undefined>(isaUndefined)
