import { type Opts, rSort } from "ranges-sort";

const ranges = [
  [2, 3],
  [1, 2],
] as [number, number][];

const disabledProgress: Opts["progressFn"] = false;
rSort(ranges, { progressFn: disabledProgress });
rSort(ranges, { progressFn: null });
rSort(ranges, { progressFn: undefined });
rSort(ranges, { progressFn: () => {} });
rSort(ranges, { strictlyTwoElementsInRangeArrays: true });

// @ts-expect-error Progress accepts callbacks and explicit disabling values only.
rSort(ranges, { progressFn: true });
// @ts-expect-error Strictness must be a Boolean.
rSort(ranges, { strictlyTwoElementsInRangeArrays: "false" });
// @ts-expect-error Options must be a plain object, not an array.
rSort(ranges, []);
// @ts-expect-error Null is not an options container.
rSort(ranges, null);
