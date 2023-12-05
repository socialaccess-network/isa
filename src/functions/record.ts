import { notaArray } from './array'
import { ISACheck, isa } from './isa'
import { nota } from './nota'
import { isaObject } from './object'

export type AnyRecord = Record<any, any>

export const isaRecord = isa<AnyRecord>(
	thing => isaObject(thing) && notaArray(thing)
)

export const notaRecord = nota<AnyRecord>(isaRecord)

export function isaTypedRecord<RecordType extends AnyRecord>(type: {
	[Key in keyof RecordType]: ISACheck<RecordType[Key]>
}) {
	return isa<RecordType>(thing => {
		return (
			isaRecord(thing) &&
			Object.entries(type).every(([key, check]) => {
				const value = thing[key]
				return check(value)
			})
		)
	})
}
