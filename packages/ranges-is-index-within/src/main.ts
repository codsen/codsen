import { version as v } from "../package.json";
const version: string = v;
import { Range, Ranges } from "../../../scripts/common";

interface Opts {
  inclusiveRangeEnds?: boolean;
  returnMatchedRangeInsteadOfTrue?: boolean;
}

const defaults: Opts = {
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false,
};

function isIndexWithin(
  originalIndex: number,
  rangesArr: Ranges,
  originalOpts?: Opts
): boolean | Range {
  const opts = { ...defaults, ...originalOpts };
  // insurance
  if (!Number.isInteger(originalIndex)) {
    throw new Error(
      `ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${originalIndex} (type ${typeof originalIndex})`
    );
  }

  if (!Array.isArray(rangesArr)) {
    return false;
  }

  if (opts.returnMatchedRangeInsteadOfTrue) {
    return (
      rangesArr.find((arr) =>
        opts.inclusiveRangeEnds
          ? originalIndex >= arr[0] && originalIndex <= arr[1]
          : originalIndex > arr[0] && originalIndex < arr[1]
      ) || false
    );
  }
  return rangesArr.some((arr) =>
    opts.inclusiveRangeEnds
      ? originalIndex >= arr[0] && originalIndex <= arr[1]
      : originalIndex > arr[0] && originalIndex < arr[1]
  );
}

export { isIndexWithin, defaults, version };
