import { ISACheck, isa } from './isa'
import { nota } from './nota'

export const isaArray = isa<unknown[]>(Array.isArray)
export const notaArray = nota<unknown[]>(isaArray)

export function isaTypedArray<ArrayType extends unknown[]>(types: {
	[Index in keyof ArrayType]: ISACheck<ArrayType[Index]>
}) {
	return isa<ArrayType>(thing => {
		return (
			isaArray(thing) && thing.every(value => types.some(type => type(value)))
		)
	})
}

export function isaExactArray<ArrayType extends unknown[]>(
	...types: {
		[Index in keyof ArrayType]: ISACheck<ArrayType[Index]>
	}
) {
	return isa<ArrayType>(thing => {
		return (
			isaArray(thing) &&
			thing.length === types.length &&
			thing.every((value, index) => types[index](value))
		)
	})
}
