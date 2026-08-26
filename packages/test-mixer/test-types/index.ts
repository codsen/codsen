import { mixer, type MixerResult, type PlainObjectOfBool } from "test-mixer";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

const defaults = {
  varied: false as const,
  mode: "safe",
  tags: ["b", "strong"],
  callback: (value: number) => value + 1,
  nullable: null,
};
const ref = {
  varied: true as const,
  mode: "strict",
};

const rows = mixer(ref, defaults);
type Row = (typeof rows)[number];
type ExpectedRow = MixerResult<typeof ref, typeof defaults>;
const rowChecks: [
  Equal<Row, ExpectedRow>,
  Equal<Row["varied"], true>,
  Equal<Row["mode"], string>,
  Equal<Row["tags"], string[]>,
  Equal<Row["callback"], (value: number) => number>,
  Equal<Row["nullable"], null>,
] = [true, true, true, true, true, true];

const allRows = mixer(undefined, defaults);
type AllRow = (typeof allRows)[number];
const allRowChecks: [
  Equal<AllRow["varied"], boolean>,
  Equal<AllRow["mode"], string>,
  Equal<AllRow["tags"], string[]>,
  Equal<AllRow["callback"], (value: number) => number>,
  Equal<AllRow["nullable"], null>,
] = [true, true, true, true, true];

const maybeRef: typeof ref | undefined = Math.random() > 0.5 ? ref : undefined;
const maybeRows = mixer(maybeRef, defaults);
type MaybeRow = (typeof maybeRows)[number];
const maybeRowChecks: [
  Equal<MaybeRow["varied"], boolean>,
  Equal<MaybeRow["mode"], string>,
] = [true, true];

const legacyBooleanRow: PlainObjectOfBool = { varied: true };

void [rowChecks, allRowChecks, maybeRowChecks, legacyBooleanRow];
