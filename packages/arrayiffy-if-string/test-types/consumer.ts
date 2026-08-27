import { arrayiffy, type StringInABox } from "arrayiffy-if-string";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

type IsAny<Value> = 0 extends 1 & Value ? true : false;

declare const brand: unique symbol;
type BrandedString = string & { readonly [brand]: true };
// biome-ignore lint/complexity/noBannedTypes: the review specifically covers the broad {} input type.
type BroadObject = {};

declare const unknownInput: unknown;
declare const anyInput: any;
declare const broadObjectInput: BroadObject;
// biome-ignore lint/complexity/noBannedTypes: this intentionally models a boxed string object.
declare const boxedStringInput: String;
declare const widenedStringInput: string;
declare const brandedStringInput: BrandedString;
declare const mixedInput: "" | "value" | 42;

const unknownResult = arrayiffy(unknownInput);
const anyResult = arrayiffy(anyInput);
const broadObjectResult = arrayiffy(broadObjectInput);
const boxedStringResult = arrayiffy(boxedStringInput);
const emptyResult = arrayiffy("");
const literalResult = arrayiffy("value");
const widenedStringResult = arrayiffy(widenedStringInput);
const brandedStringResult = arrayiffy(brandedStringInput);
const mixedResult = arrayiffy(mixedInput);

const checks: [
  Equal<StringInABox<unknown>, unknown>,
  IsAny<StringInABox<any>>,
  Equal<StringInABox<BroadObject>, BroadObject>,
  // biome-ignore lint/complexity/noBannedTypes: this intentionally models a boxed string object.
  Equal<StringInABox<String>, String>,
  Equal<typeof unknownResult, unknown>,
  IsAny<typeof anyResult>,
  Equal<typeof broadObjectResult, BroadObject>,
  // biome-ignore lint/complexity/noBannedTypes: this intentionally models a boxed string object.
  Equal<typeof boxedStringResult, String>,
  Equal<typeof emptyResult, []>,
  Equal<typeof literalResult, ["value"]>,
  Equal<typeof widenedStringResult, [] | [string]>,
  Equal<typeof brandedStringResult, [BrandedString]>,
  Equal<typeof mixedResult, [] | ["value"] | 42>,
] = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
];

// @ts-expect-error -- unknown input cannot be assumed to return an array.
const unknownArray: unknown[] = unknownResult;
// @ts-expect-error -- a boxed string passes through instead of becoming an array.
const boxedStringArray: unknown[] = boxedStringResult;

void [boxedStringArray, checks, unknownArray];
