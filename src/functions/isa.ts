export type ISA<Input, Type> = Input extends unknown
	? Type extends Input
		? Type
		: Extract<Input, Type>
	: Extract<Input, Type>

export type ISACheck<Type> = {
	'@type': Type
	<Input>(thing: Input): thing is ISA<Input, Type>
}

export function isa<Type>(check: (thing: unknown) => boolean): ISACheck<Type> {
	const validate = <Input>(thing: Input): thing is ISA<Input, Type> =>
		check(thing)

	return validate as ISACheck<Type>
}

export const isaAny = isa<any>(() => true)

export const isaUnion = <Types extends unknown[]>(
	...types: {
		[Key in keyof Types]: ISACheck<Types[Key]>
	}
): ISACheck<Types[number]> => {
	return isa<Types[number]>(thing => types.some(type => isa(type)(thing)))
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never

export function isaIntersection<Types extends unknown[]>(
	...types: {
		[Key in keyof Types]: ISACheck<Types[Key]>
	}
): ISACheck<UnionToIntersection<Types[number]>> {
	return isa(thing => types.every(type => isa(type)(thing)))
}
