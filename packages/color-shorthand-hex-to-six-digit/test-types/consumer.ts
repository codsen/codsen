import { type Converted, conv } from "color-shorthand-hex-to-six-digit";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

const stringResult = conv("#abc");
const noInputResult = conv();
const numberResult = conv(42 as const);
const callback = (value: number) => value + 1;
const date = new Date();
const nestedResult = conv({
  callback,
  color: "#abc" as const,
  date,
  nested: ["#def" as const, 1 as const] as const,
});

const basicChecks: [
  Equal<typeof stringResult, string>,
  Equal<typeof noInputResult, undefined>,
  Equal<typeof numberResult, 42>,
  Equal<typeof nestedResult.color, string>,
  Equal<typeof nestedResult.nested, readonly [string, 1]>,
  Equal<typeof nestedResult.callback, typeof callback>,
] = [true, true, true, true, true, true];

const dateResult: Date = conv(date);
const callbackResult: typeof callback = conv(callback);

interface CyclicData {
  color: string;
  self?: CyclicData;
}

declare const cyclicData: CyclicData;
const cyclicResult: Converted<CyclicData> = conv(cyclicData);

// @ts-expect-error -- string input always returns a string.
const numberFromString: number = conv("#abc");
// @ts-expect-error -- the no-argument result is undefined.
const stringFromNoInput: string = conv();
// @ts-expect-error -- converted string properties no longer retain input literals.
const originalColorLiteral: "#abc" = nestedResult.color;

void [
  basicChecks,
  callbackResult,
  cyclicResult,
  dateResult,
  numberFromString,
  originalColorLiteral,
  stringFromNoInput,
];
