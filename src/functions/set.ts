import { ISACheck, isa, nota } from '.'

export type AnySet = Set<any>

export const isaSet = isa<AnySet>(thing => thing instanceof Set)
export const notaSet = nota<AnySet>(isaSet)

export function isaTypedSet<Value>(value: ISACheck<Value>) {
	return isa<Set<Value>>(
		thing => isaSet(thing) && Array.from(thing).every(value)
	)
}
