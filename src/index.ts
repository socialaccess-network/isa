import {
	ClassType,
	Nullable,
	Optional,
	UnionToIntersection,
	isArray,
	isBigInt,
	isBoolean,
	isMap,
	isNull,
	isNumber,
	isPrimitive,
	isRecord,
	isSet,
	isString,
	isSymbol,
	notDefined,
} from '@michealpearce/utils'

export type IsaCheck<Type> = {
	// type only property to get the type of the check
	'@': Type
	(value: any): value is Type
}

type PrimitiveValue =
	| string
	| number
	| boolean
	| symbol
	| bigint
	| undefined
	| null

function checkFor<const Type>(check: (value: any) => boolean): IsaCheck<Type> {
	return check as IsaCheck<Type>
}

export type RecordModel<Type extends Record<any, any>> = {
	[Key in keyof Type]: IsaCheck<Type[Key]>
}

export type ArrayModel<Type extends object> = {
	[Key in keyof Type]: IsaCheck<Type[Key]>
}

function keys<Thing extends object>(thing: Thing): Array<keyof Thing> {
	return Object.keys(thing) as Array<keyof Thing>
}

export const isaString = checkFor<string>(isString)
export const isaNumber = checkFor<number>(isNumber)
export const isaBoolean = checkFor<boolean>(isBoolean)
export const isaSymbol = checkFor<symbol>(isSymbol)
export const isaNull = checkFor<null>(isNull)
export const isaPrimitive = checkFor<PrimitiveValue>(isPrimitive)
export const isaBigInt = checkFor<bigint>(isBigInt)

export const isaAny = checkFor<any>(() => true)
export const isaNever = checkFor<never>(() => false)

export function isaExact<Type>(value: Type): IsaCheck<Type> {
	return checkFor(val => val === value)
}

export function isaOptional<Type>(
	check: IsaCheck<Type>,
): IsaCheck<Optional<Type>> {
	return checkFor(value => check(value) || notDefined(value))
}

export function isaNullable<Type>(
	check: IsaCheck<Type>,
): IsaCheck<Nullable<Type>> {
	return checkFor(value => check(value) || isNull(value))
}

export function isaUnion<Type extends any[]>(
	...checks: ArrayModel<Type>
): IsaCheck<Type[number]> {
	return checkFor(value => checks.some(check => check(value)))
}

export function isaIntersection<Type extends object[]>(
	...checks: ArrayModel<Type>
): IsaCheck<{
	[Key in keyof UnionToIntersection<Type[number]>]: UnionToIntersection<
		Type[number]
	>[Key]
}> {
	return checkFor(value => checks.every(check => check(value)))
}

export function isaRecord<Type extends Record<any, any>>(
	model: RecordModel<Type>,
): IsaCheck<Type> {
	const props = keys(model)
	const validate = (prop: keyof Type, value: any) => model[prop](value)

	return checkFor(value => {
		if (!isRecord<Record<any, any>>(value)) return false

		for (const prop of props) {
			if (!(prop in value))
				if (validate(prop, undefined))
					// check if property is optional
					continue
				else return false
			else if (!validate(prop, value[prop])) return false
		}

		return true
	})
}

export function isaArray<Type extends any[]>(
	...checks: ArrayModel<Type>
): IsaCheck<Type[number][]> {
	const validate = (value: any) => checks.some(check => check(value))
	return checkFor(value => isArray(value) && value.every(validate))
}

export function isaExactArray<Type extends any[]>(
	...checks: ArrayModel<Type>
): IsaCheck<Type> {
	const validate = (value: any) => checks.some(check => check(value))
	return checkFor(value => isArray(value) && value.every(validate))
}

export function isaSet<Type extends any[]>(
	...checks: ArrayModel<Type>
): IsaCheck<Set<Type[number]>> {
	const validate = (value: any) => checks.some(check => check(value))
	return checkFor(value => isSet(value) && [...value].every(validate))
}

export function isaInstanceOf<Type extends object>(
	ctor: ClassType<Type>,
): IsaCheck<Type> {
	return checkFor(value => value instanceof ctor)
}

export function isaMap<Key extends any, Value extends any>(
	keyCheck: IsaCheck<Key>,
	valueCheck: IsaCheck<Value>,
): IsaCheck<Map<Key, Value>> {
	return checkFor(value => {
		if (!isMap<Map<any, any>>(value)) return false

		for (const [key, val] of value.entries())
			if (!keyCheck(key) || !valueCheck(val)) return false

		return true
	})
}

export function isaIterable<Type extends any[]>(
	...checks: ArrayModel<Type>
): IsaCheck<Iterable<Type[number]>> {
	const validate = (value: any) => checks.some(check => check(value))
	return checkFor(value => {
		if (!(typeof value === 'object') && !(Symbol.iterator in value))
			return false

		for (const item of value)
			if (validate(item)) continue
			else return false

		return true
	})
}

export const isa = {
	string: isaString,
	number: isaNumber,
	boolean: isaBoolean,
	symbol: isaSymbol,
	null: isaNull,
	primitive: isaPrimitive,
	bigint: isaBigInt,
	any: isaAny,
	never: isaNever,
	exact: isaExact,
	optional: isaOptional,
	nullable: isaNullable,
	union: isaUnion,
	intersection: isaIntersection,
	record: isaRecord,
	array: isaArray,
	exactArray: isaExactArray,
	instanceOf: isaInstanceOf,
	set: isaSet,
	map: isaMap,
	iterable: isaIterable,
}

export default isa
