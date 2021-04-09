import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-left-to-right-mark
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT MARK":
// https://www.fileformat.info/info/unicode/char/200e/index.htm

function badCharacterLeftToRightMark(context: Linter): RuleObjType {
  const charCode = 8206;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - LEFT-TO-RIGHT MARK.",
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

export default badCharacterLeftToRightMark;
