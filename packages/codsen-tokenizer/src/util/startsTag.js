import isTagOpening from "is-html-tag-opening";
import { right } from "string-left-right";
import { matchRight } from "string-match-left-right";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsTag(str, i, token, layers) {
  console.log(
    `011 ██ startsTag(): ${isTagOpening(str, i, {
      allowCustomTagNames: true
    })}`
  );
  return (
    str[i] === "<" &&
    ((token.type === "text" &&
      isTagOpening(str, i, {
        allowCustomTagNames: true
      })) ||
      !layers.length) &&
    (str[right(str, i)] === ">" ||
      isTagOpening(str, i, {
        allowCustomTagNames: true
      }) ||
      matchRight(str, i, ["doctype", "xml", "cdata"], {
        i: true,
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
      })) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

export default startsTag;
