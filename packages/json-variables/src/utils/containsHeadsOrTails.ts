import { isStr } from "codsen-utils";
import { Opts } from "../main";

export function containsHeadsOrTails(str: string, resolvedOpts: Opts): boolean {
  if (!isStr(str) || !str.trim()) {
    return false;
  }
  if (
    str.includes(resolvedOpts.heads) ||
    str.includes(resolvedOpts.tails) ||
    (isStr(resolvedOpts.headsNoWrap) &&
      resolvedOpts.headsNoWrap.length &&
      str.includes(resolvedOpts.headsNoWrap)) ||
    (isStr(resolvedOpts.tailsNoWrap) &&
      resolvedOpts.tailsNoWrap.length &&
      str.includes(resolvedOpts.tailsNoWrap))
  ) {
    return true;
  }
  return false;
}
