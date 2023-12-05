export type NOTA<Input, Type> = Exclude<Input, Type>

export type NOTACheck<Type> = {
	'@type': Type
	<Input>(thing: Input): thing is NOTA<Input, Type>
}

export function nota<Type>(
	check: (thing: unknown) => boolean
): NOTACheck<Type> {
	const validate = <Input>(thing: Input): thing is NOTA<Input, Type> =>
		!check(thing)

	return validate as NOTACheck<Type>
}
