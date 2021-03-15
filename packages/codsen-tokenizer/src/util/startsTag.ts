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
  const R1 = isOpening(str, i, {
    allowCustomTagNames: false, // <-- stricter requirements for missing opening bracket tags
    skipOpeningBracket: true,
  });
  console.log(
    `024 ███████████████████████████████████████ ${`\u001b[${
      R1 ? 32 : 31
    }m${`R1`}\u001b[${39}m`} = ${R1}`
  );
  const leftSideIdx = left(str, i) as number;
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
      // <div>some text /div>
      //                ^
      //    tag begins here
      (str[i] === "/" &&
        isLatinLetter(str[i + 1]) &&
        str[leftSideIdx] !== "<" &&
        isOpening(str, i, {
          allowCustomTagNames: false, // <-- stricter requirements for missing opening bracket tags
          skipOpeningBracket: true,
        })) ||
      (isLatinLetter(str[i]) &&
        (!str[i - 1] ||
          (!isLatinLetter(str[i - 1]) &&
            !["<", "/", "!", BACKSLASH].includes(str[leftSideIdx]))) &&
        isOpening(str, i, {
          allowCustomTagNames: false, // <-- stricter requirements for missing opening bracket tags
          skipOpeningBracket: true,
        }))) &&
    (token.type !== "esp" || (token.tail && token.tail.includes(str[i])))
  );
}

export default startsTag;
