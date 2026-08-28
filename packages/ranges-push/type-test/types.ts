import { type Opts, type Range, type RangeInput, Ranges } from "ranges-push";

const ranges = new Ranges();
ranges.add();
ranges.add(undefined, undefined);
ranges.add(null, null, null);
ranges.add("1", "2", 3);
ranges.add(["3", "4", 0]);
ranges.add([
  [5, 6],
  ["7", "8", null],
]);
ranges.push("8", 9, "x");

const current: Range[] | null = ranges.current();
ranges.replace(current);
const publicRanges: Range[] | null = ranges.ranges;
const last: Range | null = ranges.last();
const input: RangeInput = ["10", 11, 2];
const options: Partial<Opts> = { mergeType: undefined };
new Ranges(options).replace([input]);
void publicRanges;
void last;

// @ts-expect-error a supplied first index requires a second index
ranges.add(1);
// @ts-expect-error booleans are not index inputs
ranges.add(true, 2);
// @ts-expect-error insertion values are primitive strings, numbers, or nullish
ranges.add(1, 2, {});
// @ts-expect-error add() accepts no more than three scalar arguments
ranges.add(1, 2, "x", 3);
// @ts-expect-error replace() requires an array of ranges, not one range
ranges.replace([1, 2]);
// @ts-expect-error normalized options are read-only
ranges.opts.mergeType = 2;
