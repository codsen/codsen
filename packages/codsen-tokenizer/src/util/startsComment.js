import { matchLeft, matchRight } from "string-match-left-right";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsComment(str, i, token) {
  // console.log(
  //   `R1: ${!!matchRight(str, i, ["!--"], {
  //     maxMismatches: 1,
  //     firstMustMatch: true, // <--- FUZZY MATCH, BUT EXCL. MARK IS OBLIGATORY
  //     trimBeforeMatching: true
  //   }) ||
  //     matchRight(str, i, ["![endif]"], {
  //       i: true,
  //       maxMismatches: 2,
  //       trimBeforeMatching: true
  //     })}`
  // );
  // console.log(
  //   `R2: ${!matchRight(str, i, ["![cdata", "<"], {
  //     i: true,
  //     maxMismatches: 1,
  //     trimBeforeMatching: true
  //   })}`
  // );
  // console.log(`R3: ${!!(token.type !== "comment" || token.kind !== "not")}`);
  // console.log(
  //   `R3*: ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${JSON.stringify(
  //     token.kind,
  //     null,
  //     4
  //   )}`
  // );
  return (
    // the opening is deliberately loose, with one dash missing, "!-" instead of "!--"
    ((str[i] === "<" &&
      (matchRight(str, i, ["!--"], {
        maxMismatches: 1,
        firstMustMatch: true, // <--- FUZZY MATCH, BUT EXCL. MARK IS OBLIGATORY
        trimBeforeMatching: true
      }) ||
        matchRight(str, i, ["![endif]"], {
          i: true,
          maxMismatches: 2,
          trimBeforeMatching: true
        })) &&
      !matchRight(str, i, ["![cdata", "<"], {
        i: true,
        maxMismatches: 1,
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
