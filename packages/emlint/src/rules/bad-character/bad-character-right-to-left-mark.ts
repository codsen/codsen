import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-right-to-left-mark
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT MARK":
// https://www.fileformat.info/info/unicode/char/200f/index.htm

function badCharacterRightToLeftMark(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8207) {
        context.report({
          ruleId: "bad-character-right-to-left-mark",
          message: "Bad character - RIGHT-TO-LEFT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]], // just delete it
          },
        });
      }
    },
  };
}

export default badCharacterRightToLeftMark;
