import { isOpening } from "is-html-tag-opening";
import { matchRight } from "string-match-left-right";
import { backslash, isLatinLetter } from "codsen-utils";

import { Token, Layer } from "./util";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsTag(
  str: string,
  i: number,
  token: Token,
  layers: Layer[],
  withinStyle: boolean,
  leftVal: number | null,
  rightVal: number | null
): boolean {
  return !!(
    str[i]?.trim().length &&
    (!layers.length || token.type === "text") &&
    (!(token as any).kind ||
      !["doctype", "xml"].includes((token as any).kind)) &&
    // within CSS styles, initiate tags only on opening bracket:
    (!withinStyle || str[i] === "<") &&
    ((str[i] === "<" &&
      (isOpening(str, i, {
        allowCustomTagNames: true,
      }) ||
        str[rightVal as number] === ">" ||
        matchRight(str, i, ["doctype", "xml", "cdata"], {
          i: true,
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
        }))) ||
      // <div>some text /div>
      //                ^
      //    tag begins here
      (str[i] === "/" &&
        isLatinLetter(str[i + 1]) &&
        str[leftVal as number] !== "<" &&
        isOpening(str, i, {
          allowCustomTagNames: true, // loose requirements because of slash
          skipOpeningBracket: true,
        })) ||
      (isLatinLetter(str[i]) &&
        (!str[i - 1] ||
          (!isLatinLetter(str[i - 1]) &&
            !["<", "/", "!", backslash].includes(str[leftVal as number]))) &&
        isOpening(str, i, {
          allowCustomTagNames: false, // <-- stricter requirements for missing opening bracket tags
          skipOpeningBracket: true,
        }))) &&
    (token.type !== "esp" || token?.tail?.includes(str[i]))
  );
}

export default startsTag;
