import type { Ranges, Range as RangeType } from "../../../ops/typedefs/common";

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
  opts?: Partial<Opts>,
): boolean | RangeType {
  // insurance
  if (!Number.isInteger(index) || index < 0) {
    throw new TypeError(
      `ranges-is-index-within/isIndexWithin(): [THROW_ID_01] The first input argument should be a string index: a natural number or zero. It was ${index} (type ${typeof index}).`,
    );
  }

  if (!Array.isArray(rangesArr)) {
    return false;
  }

  let inclusiveRangeEnds = opts?.inclusiveRangeEnds ?? false;
  let returnMatchedRange = opts?.returnMatchedRangeInsteadOfTrue ?? false;
  for (let i = 0; i < rangesArr.length; i++) {
    let range = rangesArr[i];
    let matches = inclusiveRangeEnds
      ? index >= range[0] && index <= range[1]
      : index > range[0] && index < range[1];
    if (matches) {
      return returnMatchedRange ? range : true;
    }
  }
  return false;
}

export {
  defaults,
  isIndexWithin,
  type Ranges,
  type RangeType as Range,
  version,
};
