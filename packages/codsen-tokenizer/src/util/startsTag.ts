import { isOpening } from "is-html-tag-opening";
import { left, right } from "string-left-right";
import { matchRight } from "string-match-left-right";
import { isLatinLetter, Token, Layer } from "./util";

const BACKSLASH = "\u005C";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsTag(
  str: string,
  i: number,
  token: Token,
  layers: Layer[],
  withinStyle: boolean
): boolean {
  console.log(
    `020 ██ startsTag() isOpening1: ${isOpening(str, i, {
      allowCustomTagNames: true,
    })}`
  );
  console.log(
    `025 ██ startsTag() isOpening2: ${isOpening(str, i, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    })}`
  );
  return !!(
    str[i] &&
    str[i].trim().length &&
    (!layers.length || token.type === "text") &&
    (!(token as any).kind ||
      !["doctype", "xml"].includes((token as any).kind)) &&
    // within CSS styles, initiate tags only on opening bracket:
    (!withinStyle || str[i] === "<") &&
    ((str[i] === "<" &&
      (isOpening(str, i, {
        allowCustomTagNames: true,
      }) ||
        str[right(str, i) as number] === ">" ||
        matchRight(str, i, ["doctype", "xml", "cdata"], {
          i: true,
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
        }))) ||
      (isLatinLetter(str[i]) &&
        (!str[i - 1] ||
          (!isLatinLetter(str[i - 1]) &&
            !["<", "/", "!", BACKSLASH].includes(
              str[left(str, i) as number]
            ))) &&
        isOpening(str, i, {
          allowCustomTagNames: false, // <-- stricter requirements for missing opening bracket tags
          skipOpeningBracket: true,
        }))) &&
    (token.type !== "esp" || (token.tail && token.tail.includes(str[i])))
  );
}

export default startsTag;
