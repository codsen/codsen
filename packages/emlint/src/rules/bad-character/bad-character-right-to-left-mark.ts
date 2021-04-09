import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-right-to-left-mark
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT MARK":
// https://www.fileformat.info/info/unicode/char/200f/index.htm

function badCharacterRightToLeftMark(context: Linter): RuleObjType {
  const charCode = 8207;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
