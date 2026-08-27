import {
  type BooleanCombination,
  type BoolObj,
  type Combination,
  combinations,
  type UnknownValueObject,
} from "object-boolean-combinations";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

const input = {
  callback: (value: number) => value + 1,
  enabled: new Date(),
  metadata: new Map([["mode", "safe"]]),
};

const booleanRows = combinations(input);
type BooleanRow = (typeof booleanRows)[number];
const booleanChecks: [
  Equal<BooleanRow, BooleanCombination<typeof input>>,
  Equal<BooleanRow["callback"], boolean>,
  Equal<BooleanRow["enabled"], boolean>,
  Equal<BooleanRow["metadata"], boolean>,
] = [true, true, true, true];

const fixedRows = combinations(input, {
  enabled: new Date(),
  extra: "ignored",
  metadata: { mode: "strict" as const },
});
type FixedRow = (typeof fixedRows)[number];
type ExpectedFixedRow = Combination<
  typeof input,
  {
    enabled: Date;
    extra: string;
    metadata: { mode: "strict" };
  }
>;
const fixedChecks: [
  Equal<FixedRow, ExpectedFixedRow>,
  Equal<FixedRow["callback"], boolean>,
  Equal<FixedRow["enabled"], Date>,
  Equal<FixedRow["metadata"], { mode: "strict" }>,
  Equal<"extra" extends keyof FixedRow ? true : false, false>,
] = [true, true, true, true, true];

declare const optionalOverride: { enabled?: Date };
const optionalRows = combinations(input, optionalOverride);
type OptionalRow = (typeof optionalRows)[number];
const optionalChecks: [
  Equal<OptionalRow["enabled"], boolean | Date | undefined>,
] = [true];

const broadInput: UnknownValueObject = { value: Symbol("value") };
const broadRows = combinations(broadInput);
const legacyRow: BoolObj = broadRows[0];

// @ts-expect-error -- the input container must be a plain object.
combinations(null);
// @ts-expect-error -- the input container must be a plain object.
combinations("input");
// @ts-expect-error -- arrays are values, not plain-object input containers.
combinations([]);
// @ts-expect-error -- dates are values, not plain-object input containers.
combinations(new Date());
// @ts-expect-error -- functions are values, not plain-object input containers.
combinations(() => {});
// @ts-expect-error -- the override container must be a plain object.
combinations({}, []);

void [booleanChecks, fixedChecks, optionalChecks, legacyRow];
