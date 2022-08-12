import type { Range, Ranges } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  inclusiveRangeEnds: boolean;
  returnMatchedRangeInsteadOfTrue: boolean;
}

const defaults: Opts = {
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false,
};

function isIndexWithin(
  index: number,
  rangesArr: Ranges,
  opts?: Partial<Opts>
): boolean | Range {
  let resolvedOpts = { ...defaults, ...opts };
  // insurance
  if (!Number.isInteger(index)) {
    throw new Error(
      `ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${index} (type ${typeof index})`
    );
  }

  if (!Array.isArray(rangesArr)) {
    return false;
  }

  if (resolvedOpts.returnMatchedRangeInsteadOfTrue) {
    return (
      rangesArr.find((arr) =>
        resolvedOpts.inclusiveRangeEnds
          ? index >= arr[0] && index <= arr[1]
          : index > arr[0] && index < arr[1]
      ) || false
    );
  }
  return rangesArr.some((arr) =>
    resolvedOpts.inclusiveRangeEnds
      ? index >= arr[0] && index <= arr[1]
      : index > arr[0] && index < arr[1]
  );
}

export { isIndexWithin, defaults, version, Range, Ranges };
