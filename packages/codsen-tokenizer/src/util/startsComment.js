import { matchLeft, matchRight } from "string-match-left-right";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsComment(str, i, token) {
  return (
    // the opening is deliberately loose, with one dash missing, "!-" instead of "!--"
    ((str[i] === "<" &&
      matchRight(
        str,
        i,
        [
          "!-",
          "![",
          "[endif",
          "!endif",
          "1endif",
          "[!endif",
          "]!endif",
          "!]endif"
        ],
        {
          i: true,
          trimBeforeMatching: true
        }
      ) &&
      !matchRight(str, i, ["![cdata", "[cdata", "!cdata"], {
        i: true,
        trimBeforeMatching: true
      }) &&
      (token.type !== "comment" || token.kind !== "not")) ||
      (str[i] === "-" &&
        matchRight(str, i, ["->"], {
          trimBeforeMatching: true
        }) &&
        (token.type !== "comment" ||
          (!token.closing && token.kind !== "not")) &&
        !matchLeft(str, i, "<", {
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["-", "!"]
        }))) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

export default startsComment;
