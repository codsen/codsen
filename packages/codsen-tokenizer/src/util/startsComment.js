import { matchRightIncl } from "string-match-left-right";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsComment(str, i, token) {
  return (
    // the opening is deliberately loose, with one dash missing, "!-" instead of "!--"
    (matchRightIncl(str, i, ["<!-", "<!["]) ||
      matchRightIncl(str, i, ["-->"])) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

export default startsComment;
