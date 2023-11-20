/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
/** Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). @category Type */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/** Infer the length of the given array `<T>`.
@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f */
export type TupleLength<T extends readonly unknown[]> = T extends { readonly length: infer L } ? L : never;

/**
Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.

@example
```
type PositionProps = {
  top: number;
  left: number;
};

type SizeProps = {
  width: number;
  height: number;
};

// In your editor, hovering over `Props` will show a flattened object with all the properties.
type Props = Simplify<PositionProps & SizeProps>;
```

Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.

If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.

@example
```
interface SomeInterface {
  foo: number;
  bar?: string;
  baz: number | undefined;
}

type SomeType = {
  foo: number;
  bar?: string;
  baz: number | undefined;
};

const literal = {foo: 123, bar: 'hello', baz: 456};
const someType: SomeType = literal;
const someInterface: SomeInterface = literal;

function fn(object: Record<string, unknown>): void {}

fn(literal); // Good: literal object type is sealed
fn(someType); // Good: type is sealed
fn(someInterface); // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
fn(someInterface as Simplify<SomeInterface>); // Good: transform an `interface` into a `type`
```
@link https://github.com/microsoft/TypeScript/issues/15300

@category Object
*/
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

/**
Gets keys from a type. Similar to `keyof` but this one also works for union types.

The reason a simple `keyof Union` does not work is because `keyof` always returns the accessible keys of a type.
In the case of a union, that will only be the common keys.

@link https://stackoverflow.com/a/49402091*/
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type UpperCaseCharacters = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type StringDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Whitespace =
  | '\u{9}' // '\t'
  | '\u{A}' // '\n'
  | '\u{B}' // '\v'
  | '\u{C}' // '\f'
  | '\u{D}' // '\r'
  | '\u{20}' // ' '
  | '\u{85}'
  | '\u{A0}'
  | '\u{1680}'
  | '\u{2000}'
  | '\u{2001}'
  | '\u{2002}'
  | '\u{2003}'
  | '\u{2004}'
  | '\u{2005}'
  | '\u{2006}'
  | '\u{2007}'
  | '\u{2008}'
  | '\u{2009}'
  | '\u{200A}'
  | '\u{2028}'
  | '\u{2029}'
  | '\u{202F}'
  | '\u{205F}'
  | '\u{3000}'
  | '\u{FEFF}';

type WordSeparators = '-' | '_' | Whitespace;

/** Remove spaces from the left side. */
type TrimLeft<V extends string> = V extends `${Whitespace}${infer R}` ? TrimLeft<R> : V;

/** Remove spaces from the right side. */
type TrimRight<V extends string> = V extends `${infer R}${Whitespace}` ? TrimRight<R> : V;

/**
Remove leading and trailing spaces from a string.

@example
```
import type {Trim} from 'type-fest';

Trim<' foo '>
//=> 'foo'
```
@category String
@category Template literal
*/
export type Trim<V extends string> = TrimLeft<TrimRight<V>>;

/** Matches any unknown array or tuple. */
type UnknownArrayOrTuple = readonly [...unknown[]];

/** Extracts the type of the first element of an array or tuple. */
export type FirstArrayElement<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
  ? THead
  : never;

/** Extracts the type of an array or tuple minus the first element. */
export type ArrayTail<TArray extends UnknownArrayOrTuple> = TArray extends readonly [unknown, ...infer TTail] ? TTail : [];

/**
Returns a boolean for whether the string is lowercased.
*/
type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false;

/**
Returns a boolean for whether the string is uppercased.
*/
type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;

/**
Returns a boolean for whether a string is whitespace.
*/
export type IsWhitespace<T extends string> = T extends Whitespace
  ? true : T extends `${Whitespace}${infer Rest}`
  ? IsWhitespace<Rest> : false;

/**
Returns a boolean for whether the string is numeric.

This type is a workaround for [Microsoft/TypeScript#46109](https://github.com/microsoft/TypeScript/issues/46109#issuecomment-930307987).
*/
type IsNumeric<T extends string> = T extends `${number}`
  ? Trim<T> extends T
  ? true
  : false
  : false;

// Transforms a string that is fully uppercase into a fully lowercase version. Needed to add support for SCREAMING_SNAKE_CASE, see https://github.com/sindresorhus/type-fest/issues/385
type UpperCaseToLowerCase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T;

// This implementation does not support SCREAMING_SNAKE_CASE, it is used internally by `SplitIncludingDelimiters`.
type SplitIncludingDelimiters_<Source extends string, Delimiter extends string> =
  Source extends '' ? [] :
  Source extends `${infer FirstPart}${Delimiter}${infer SecondPart}` ?
  (
    Source extends `${FirstPart}${infer UsedDelimiter}${SecondPart}`
    ? UsedDelimiter extends Delimiter
    // eslint-disable-next-line no-shadow
    ? Source extends `${infer FirstPart}${UsedDelimiter}${infer SecondPart}`
    ? [...SplitIncludingDelimiters<FirstPart, Delimiter>, UsedDelimiter, ...SplitIncludingDelimiters<SecondPart, Delimiter>]
    : never
    : never
    : never
  ) :
  [Source];

/**
Unlike a simpler split, this one includes the delimiter splitted on in the resulting array literal. This is to enable splitting on, for example, upper-case characters.

@category Template literal */
type SplitIncludingDelimiters<Source extends string, Delimiter extends string> = SplitIncludingDelimiters_<UpperCaseToLowerCase<Source>, Delimiter>;

/**
Format a specific part of the splitted string literal that `StringArrayToDelimiterCase<>` fuses together, ensuring desired casing.

@see StringArrayToDelimiterCase
*/
type StringPartToDelimiterCase<StringPart extends string, Start extends boolean, UsedWordSeparators extends string, UsedUpperCaseCharacters extends string, Delimiter extends string> =
  StringPart extends UsedWordSeparators ? Delimiter :
  Start extends true ? Lowercase<StringPart> :
  StringPart extends UsedUpperCaseCharacters ? `${Delimiter}${Lowercase<StringPart>}` :
  StringPart;

/**
Takes the result of a splitted string literal and recursively concatenates it together into the desired casing.

It receives `UsedWordSeparators` and `UsedUpperCaseCharacters` as input to ensure it's fully encapsulated.

@see SplitIncludingDelimiters*/
type StringArrayToDelimiterCase<Parts extends readonly any[], Start extends boolean, UsedWordSeparators extends string, UsedUpperCaseCharacters extends string, Delimiter extends string> =
  Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
  ? `${StringPartToDelimiterCase<FirstPart, Start, UsedWordSeparators, UsedUpperCaseCharacters, Delimiter>}${StringArrayToDelimiterCase<RemainingParts, false, UsedWordSeparators, UsedUpperCaseCharacters, Delimiter>}`
  : Parts extends [string]
  ? string
  : '';

/**
Convert a string literal to a custom string delimiter casing.

This can be useful when, for example, converting a camel-cased object property to an oddly cased one.

@see KebabCase
@see SnakeCase

@example
``` typescript
// Simple
const someVariable: DelimiterCase<'fooBar', '#'> = 'foo#bar';

// Advanced
type OddlyCasedProperties<T> = {
  [K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

interface SomeOptions {
  dryRun: boolean;
  includeFile: string;
  foo: number;
}

const rawCliOptions: OddlyCasedProperties<SomeOptions> = {
  'dry#run': true,
  'include#file': 'bar.js',
  foo: 123
};
```

@category Change case
@category Template literal
*/
type DelimiterCase<Value, Delimiter extends string> = string extends Value ? Value : Value extends string
  ? StringArrayToDelimiterCase<
    SplitIncludingDelimiters<Value, WordSeparators | UpperCaseCharacters>,
    true,
    WordSeparators,
    UpperCaseCharacters,
    Delimiter
  >
  : Value;


/**
Convert a string literal to snake-case.

This can be useful when, for example, converting a camel-cased object property to a snake-cased SQL column name.

@example
``` typescript
// Simple
const someVariable: SnakeCase<'fooBar'> = 'foo_bar';

// Advanced
type SnakeCasedProperties<T> = {
  [K in keyof T as SnakeCase<K>]: T[K]
};

interface ModelProps {
  isHappy: boolean;
  fullFamilyName: string;
  foo: number;
}

const dbResult: SnakeCasedProperties<ModelProps> = {
  'is_happy': true,
  'full_family_name': 'Carla Smith',
  foo: 123
};
```

@category Change case
@category Template literal
*/
export type SnakeCase<Value> = DelimiterCase<Value, '_'>;


type SkipEmptyWord<Word extends string> = Word extends '' ? [] : [Word];

type RemoveLastCharacter<Sentence extends string, Character extends string> = Sentence extends `${infer LeftSide}${Character}`
  ? SkipEmptyWord<LeftSide>
  : never;

/**
Split a string (almost) like Lodash's `_.words()` function.

- Split on each word that begins with a capital letter.
- Split on each {@link WordSeparators}.
- Split on numeric sequence.

@example
```
type Words0 = SplitWords<'helloWorld'>; // ['hello', 'World']
type Words1 = SplitWords<'helloWORLD'>; // ['hello', 'WORLD']
type Words2 = SplitWords<'hello-world'>; // ['hello', 'world']
type Words3 = SplitWords<'--hello the_world'>; // ['hello', 'the', 'world']
type Words4 = SplitWords<'lifeIs42'>; // ['life', 'Is', '42']
```

@internal
@category Change case
@category Template literal
*/
type SplitWords<
  Sentence extends string,
  LastCharacter extends string = '',
  CurrentWord extends string = '',
> = Sentence extends `${infer FirstCharacter}${infer RemainingCharacters}`
  ? FirstCharacter extends WordSeparators
  // Skip word separator
  ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters>]
  : LastCharacter extends ''
  // Fist char of word
  ? SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>
  // Case change: non-numeric to numeric, push word
  : [false, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
  ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
  // Case change: numeric to non-numeric, push word
  : [true, false] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
  ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
  // No case change: concat word
  : [true, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
  ? SplitWords<RemainingCharacters, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
  // Case change: lower to upper, push word
  : [true, true] extends [IsLowerCase<LastCharacter>, IsUpperCase<FirstCharacter>]
  ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
  // Case change: upper to lower, brings back the last character, push word
  : [true, true] extends [IsUpperCase<LastCharacter>, IsLowerCase<FirstCharacter>]
  ? [...RemoveLastCharacter<CurrentWord, LastCharacter>, ...SplitWords<RemainingCharacters, FirstCharacter, `${LastCharacter}${FirstCharacter}`>]
  // No case change: concat word
  : SplitWords<RemainingCharacters, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
  : [...SkipEmptyWord<CurrentWord>];


/**
CamelCase options.

@see {@link CamelCase}
*/
type CamelCaseOptions = {
  /**
  Whether to preserved consecutive uppercase letter.

  @default true
  */
  preserveConsecutiveUppercase?: boolean;
};

/**
Convert an array of words to camel-case.
*/
type CamelCaseFromArray<
  Words extends string[],
  Options extends CamelCaseOptions,
  OutputString extends string = '',
> = Words extends [
  infer FirstWord extends string,
  ...infer RemainingWords extends string[],
]
  ? Options['preserveConsecutiveUppercase'] extends true
  ? `${Capitalize<FirstWord>}${CamelCaseFromArray<RemainingWords, Options>}`
  : `${Capitalize<Lowercase<FirstWord>>}${CamelCaseFromArray<RemainingWords, Options>}`
  : OutputString;

/**
Convert a string literal to camel-case.

This can be useful when, for example, converting some kebab-cased command-line flags or a snake-cased database result.

By default, consecutive uppercase letter are preserved. See {@link CamelCaseOptions.preserveConsecutiveUppercase preserveConsecutiveUppercase} option to change this behavior.

@example
```
// Simple
const someVariable: CamelCase<'foo-bar'> = 'fooBar';

// Advanced
type CamelCasedProperties<T> = {
  [K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
  'dry-run': boolean;
  'full_family_name': string;
  foo: number;
  BAR: string;
  QUZ_QUX: number;
  'OTHER-FIELD': boolean;
}

const dbResult: CamelCasedProperties<RawOptions> = {
  dryRun: true,
  fullFamilyName: 'bar.js',
  foo: 123,
  bar: 'foo',
  quzQux: 6,
  otherField: false
};
```

@category Change case
@category Template literal
*/
export type CamelCase<Type, Options extends CamelCaseOptions = { preserveConsecutiveUppercase: true }> = Type extends string
  ? string extends Type
  ? Type
  : Uncapitalize<CamelCaseFromArray<SplitWords<Type extends Uppercase<Type> ? Lowercase<Type> : Type>, Options>>
  : Type;

/**
Converts a string literal to pascal-case.
@example
``` typescript
// Simple
const someVariable: PascalCase<'foo-bar'> = 'FooBar';

// Advanced
type PascalCaseProps<T> = {
  [K in keyof T as PascalCase<K>]: T[K]
};

interface RawOptions {
  'dry-run': boolean;
  'full_family_name': string;
  foo: number;
}

const dbResult: CamelCasedProperties<ModelProps> = {
  DryRun: true,
  FullFamilyName: 'bar.js',
  Foo: 123
};
```
@category Change case
@category Template literal
*/
export type PascalCase<Value> = CamelCase<Value> extends string
  ? Capitalize<CamelCase<Value>>
  : CamelCase<Value>;

type PascalCaseOption = 'pascal'
type CamelCaseOption = 'camel'
type SnakeCaseOption = 'snake'
type TitleCaseOption = 'title'

export type CaseOptions = PascalCaseOption | CamelCaseOption | SnakeCaseOption | TitleCaseOption;

export default function toCase<Text extends string = string, Case extends Exclude<CaseOptions, TitleCaseOption> = PascalCaseOption | SnakeCaseOption | CamelCaseOption>(str: Text, caseType: Case = 'camel' as Case) {
  if (!str) return str;
  const strArray: string[] = str.split(/(?=[A-Z])|\s+/);
  const newStrArray: string[] = strArray.map((word, index) => {
    if (caseType === 'pascal' || (caseType === 'camel' && index !== 0)) {
      return (word === word.toUpperCase()) ? word : (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    }
    return (word === word.toUpperCase() && index !== 0) ? word : word.toLowerCase();

  });

  if (caseType === 'snake') return newStrArray.join('_') as Case extends 'snake' ? SnakeCase<Text> : never;
  if (caseType === 'camel') return newStrArray.join('') as Case extends 'camel' ? CamelCase<Text> : never;
  return newStrArray.join('') as Case extends 'pascal' ? PascalCase<Text> : never;
}
