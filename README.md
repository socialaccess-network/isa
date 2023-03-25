# @sa-net/isa

A simple and lightweight library for creating and validating javascript variables. It is designed to be used with [typescript](https://www.typescriptlang.org/), but can also be used with plain javascript.

If using typescript, it requires version 5.0 or higher as it makes heavy use of `const` generics.

## Installation

```bash
yarn add @sa-net/isa
# or
npm install @sa-net/isa
```

## Examples

### Basic usage

```typescript
import { isa } from '@sa-net/isa';

const isaUser = isa.record({
	name: isa.string
	age: isa.number
})

// ...

const user: unknown = {
	name: 'John Doe',
	age: 42
}

if (isaUser(user)) {
	// user is now of type { name: string, age: number }
	console.log(user.name, user.email)
}
```

### Unions and Intersections

isa checks can be combined using `isa.union` and `isa.intersection` to create more complex checks.

```typescript
const hasName = isa.record({
	name: isa.string,
})

const hasAge = isa.record({
	age: isa.number,
})

// has type { name: string } | { age: number }
const hasNameOrAge = isa.union(hasName, hasAge)

// has type
// { name: string, age: number }
const hasNameAndAge = isa.intersection(hasName, hasAge)
```

### Optional and Nullable

isa checks can be made optional or nullable using `isa.optional` and `isa.nullable`.

```typescript
// has type { name: Optional<string>, age: Nullable<number> }
const isUser = isa.record({
	name: isa.optional(isa.string),
	age: isa.nullable(isa.number),
})
```

Notice with optional how the `name` property in the previous example does not have a `?:`. This means typescript is expecting the `name` property to exist on the object, but it can be `undefined`.

`isa.record` will still validate records missing a `name` property provided the check for it allows `undefined` as a value.

This is a current limitation of isa, but hopefully will be fixed in the future by looking for properties with the `Optional` type.

To get around this currently, you can provide a type to the `isa.record` function.

```typescript
// has type { name?: Optional<string> }
const isUser = isa.record<{ name?: Optional<string> }>({
	name: isa.optional(isa.string),
})
```

### Combining isa checks

```typescript
const hasName = isa.record({
	name: isa.string
})

const hasAge = isa.record({
	age: isa.number
})

// has type { name: string, age: number }
const hasNameAndAge = isa.intersection(hasName, hasAge)

// has type
// { name: string, age: number, roles: Array<'admin' | 'user'> }
const isUser = isa.intersection(hasNameAndAge, isa.record({
	roles: isa.array(isa.exact('admin'), isa.exact('user'))
}))

// has type
// { msgs: Array<string> | string, user: Nullable<{ name: string, age: number, roles: Array<'admin' | 'user'> }> }
const isData = isa.record({
	msgs: isa.union(isa.array(isa.string), isa.string)
	user: isa.nullable(isUser)
})
```

## Custom isa functions

isa functions are just typescript type guards. However, a utility function is provided that can be used to create type guards with a additional `@` type-only property that can be used to get the type of what the type guard is checking for.

```typescript
import { checkFor, IsaType } from '@sa-net/isa'

class User {
	declare name: string
}

export const isaUser = checkFor<User>(value => value instanceof User)

// User
type ExtractedType = IsaType<typeof isaUser>
```
