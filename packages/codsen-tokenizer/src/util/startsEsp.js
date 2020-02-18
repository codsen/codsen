import { left } from "string-left-right";
import { espChars } from "../util";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsEsp(str, i, token, layers, styleStarts) {
  return (
    espChars.includes(str[i]) &&
    str[i + 1] &&
    espChars.includes(str[i + 1]) &&
    token.type !== "rule" &&
    token.type !== "at" &&
    !(str[i] === "-" && str[i + 1] === "-") &&
    !(
      // insurance against repeated percentages
      (
        "0123456789".includes(str[left(str, i)]) &&
        (!str[i + 2] ||
          [`"`, `'`, ";"].includes(str[i + 2]) ||
          !str[i + 2].trim().length)
      )
    ) &&
    !(styleStarts && ("{}".includes(str[i]) || "{}".includes(str[i + 1])))
  );
}

export default startsEsp;
