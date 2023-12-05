import { isa, nota } from '.'

export const isaSymbol = isa<symbol>(thing => typeof thing === 'symbol')
export const notaSymbol = nota<symbol>(isaSymbol)
