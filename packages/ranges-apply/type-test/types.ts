import {
  rApply,
  type ProgressFn,
  type ProgressInput,
  type Range,
  type RangeInput,
  type Ranges,
  type RangesInput,
} from "ranges-apply";

const callback: ProgressFn = (percentage) => {
  const value: number = percentage;
  void value;
};
const progressInputs: ProgressInput[] = [
  undefined,
  null,
  false,
  0,
  "",
  callback,
];

const single: RangeInput = ["1", 3, 0];
const nested: RangesInput = [[0, "1"], null, ["2", "3", "X"]];
const canonicalRange: Range = [1, 3, 0];
const canonicalRanges: Ranges = [canonicalRange];

rApply("abcdef", single);
rApply("abcdef", nested);
rApply("abcdef", null);
for (const progress of progressInputs) {
  rApply("abcdef", canonicalRanges, progress);
}

// @ts-expect-error canonical ranges contain normalized numeric indexes
const invalidCanonicalRange: Range = ["1", 3];
// @ts-expect-error booleans are not index inputs
rApply("abcdef", [[true, 2]]);
// @ts-expect-error objects are not replacement inputs
rApply("abcdef", [[1, 2, {}]]);
// @ts-expect-error NaN has the broad number type and is not a progress sentinel
rApply("abcdef", [[1, 2]], Number.NaN);
void invalidCanonicalRange;
