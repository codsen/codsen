import isTagOpening from "is-html-tag-opening";
import { left, right } from "string-left-right";
import { matchRight } from "string-match-left-right";
import { isLatinLetter } from "./util";

const BACKSLASH = "\u005C";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsTag(str, i, token, layers, withinStyle) {
  console.log(
    `014 ██ startsTag() isTagOpening1: ${isTagOpening(str, i, {
      allowCustomTagNames: true,
    })}`
  );
  console.log(
    `019 ██ startsTag() isTagOpening2: ${isTagOpening(str, i, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    })}`
  );
  return (
    str[i] &&
    str[i].trim().length &&
    (!layers.length || token.type === "text") &&
    !["doctype", "xml"].includes(token.kind) &&
    ((str[i] === "<" &&
      (isTagOpening(str, i, {
        allowCustomTagNames: true,
      }) ||
        str[right(str, i)] === ">" ||
        matchRight(str, i, ["doctype", "xml", "cdata"], {
          i: true,
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
        }))) ||
      (isLatinLetter(str[i]) &&
        (!str[i - 1] ||
          (!isLatinLetter(str[i - 1]) &&
            !["<", "/", "!", BACKSLASH].includes(str[left(str, i)]))) &&
        isTagOpening(str, i, {
          allowCustomTagNames: false, // <-- stricter requirements for missing opening bracket tags
          skipOpeningBracket: true,
        }))) &&
    (token.type !== "esp" || (token.tail && token.tail.includes(str[i]))) &&
    // within CSS styles, initiate tags only on opening bracket:
    (!withinStyle || str[i] === "<")
  );
}

export default startsTag;
