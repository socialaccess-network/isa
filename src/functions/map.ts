import { ISACheck, isa, nota } from '.'

export type AnyMap = Map<any, any>

export const isaMap = isa<AnyMap>(thing => thing instanceof Map)
export const notaMap = nota<AnyMap>(isaMap)

export function isaTypedMap<Key, Value>(
	key: ISACheck<Key>,
	value: ISACheck<Value>
) {
	return isa<Map<Key, Value>>(
		thing =>
			isaMap(thing) && Array.from(thing).every(([k, v]) => key(k) && value(v))
	)
}
