import isTagOpening from "is-html-tag-opening";
import { left, right } from "string-left-right";
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
    str[i] &&
    str[i].trim().length &&
    (!layers.length || token.type === "text") &&
    ((str[i] === "<" &&
      (isTagOpening(str, i, {
        allowCustomTagNames: true
      }) ||
        str[right(str, i)] === ">" ||
        matchRight(str, i, ["doctype", "xml", "cdata"], {
          i: true,
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        }))) ||
      (str[left(str, i)] === ">" &&
        isTagOpening(str, i, {
          allowCustomTagNames: true,
          skipOpeningBracket: true
        }))) &&
    // (
    //   (str[i] === "<" &&
    //   (
    //     str[right(str, i)] === ">" ||
    //     isTagOpening(str, i, {
    //       allowCustomTagNames: true
    //     }) ||
    //     matchRight(str, i, ["doctype", "xml", "cdata"], {
    //       i: true,
    //       trimBeforeMatching: true,
    //       trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
    //     })
    //   ))
    // ) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

export default startsTag;
