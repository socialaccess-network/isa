import { isa } from './isa'
import { nota } from './nota'

export const isaString = isa<string>(thing => typeof thing === 'string')
export const notaString = nota<string>(isaString)

export function isaTypedString<StringType extends string>(type: StringType) {
	return isa<StringType>(thing => isaString(thing) && thing === type)
}
