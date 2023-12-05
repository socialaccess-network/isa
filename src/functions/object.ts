import { isa } from './isa'
import { nota } from './nota'
import { notaNull } from './null'

export const isaObject = isa<object>(
	thing => typeof thing === 'object' && notaNull(thing)
)

export const notaObject = nota<object>(isaObject)
