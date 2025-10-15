import { isStr } from "codsen-utils";
import { matchLeftIncl, matchRightIncl } from "string-match-left-right";

export function removeWrappingHeadsAndTails(
  str: string,
  heads: string | string[],
  tails: string | string[],
): string {
  let tempFrom;
  let tempTo;
  if (
    isStr(str) &&
    str.length &&
    matchRightIncl(str, 0, heads, {
      trimBeforeMatching: true,
      cb: (_c, _t, index) => {
        tempFrom = index;
        return true;
      },
    }) &&
    matchLeftIncl(str, str.length - 1, tails, {
      trimBeforeMatching: true,
      cb: (_c, _t, index) => {
        tempTo = (index || 0) + 1;
        return true;
      },
    })
  ) {
    return str.slice(tempFrom, tempTo);
  }
  return str;
}
