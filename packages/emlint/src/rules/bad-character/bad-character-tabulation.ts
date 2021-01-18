import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-tabulation
// -----------------------------------------------------------------------------

// Catches raw character "TABULATION" or simply "TAB":
// https://www.fileformat.info/info/unicode/char/0009/index.htm

import { leftStopAtNewLines } from "string-left-right";

interface BadCharacterTabulation {
  (context: Linter, mode: string): RuleObjType;
}
const badCharacterTabulation: BadCharacterTabulation = (
  context,
  ...originalOpts
) => {
  console.log(
    `${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );

  // indentation tabs might be OK, check config.
  // tabs between text not OK.
  // tabs trailing lines, leading to EOL or line break, not OK. ("right-side indentation")

  // plan: use "leftStopAtNewLines" method, it stops at first non-whitespace
  // character or linebreaks of both kinds: CR or LF.

  let mode: "never" | "indentationIsFine" = "never";
  if (
    Array.isArray(originalOpts) &&
    originalOpts[0] &&
    typeof originalOpts[0] === "string" &&
    originalOpts[0].toLowerCase() === "indentationisfine"
  ) {
    mode = "indentationIsFine";
  }

  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 9) {
        if (mode === "never") {
          // simple - there can't be any TABs, so raise it straight away
          context.report({
            ruleId: "bad-character-tabulation",
            message: "Bad character - TABULATION.",
            idxFrom: i,
            idxTo: i + 1,
            fix: {
              ranges: [[i, i + 1, " "]], // replace with one space
            },
          });
        } else if (mode === "indentationIsFine") {
          // leftStopAtNewLines() will stop either at first non-whitespace character
          // on the left, or LF or CR. By evaluating the trim of it, we can
          // filter out cases where it's non-whitespace character. In other
          // words, that's TAB in the middle of the line, between letter characters.
          const charTopOnBreaksIdx = leftStopAtNewLines(context.str, i);
          if (
            charTopOnBreaksIdx !== null &&
            context.str[charTopOnBreaksIdx].trim().length
          ) {
            context.report({
              ruleId: "bad-character-tabulation",
              message: "Bad character - TABULATION.",
              idxFrom: i,
              idxTo: i + 1,
              fix: {
                ranges: [[i, i + 1, " "]], // replace with one space
              },
            });
          }
        }
      }
    },
  };
};

export default badCharacterTabulation;
