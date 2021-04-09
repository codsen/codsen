import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-single-shift-three
// -----------------------------------------------------------------------------

// Catches raw character "SINGLE SHIFT THREE":
// https://www.fileformat.info/info/unicode/char/008f/index.htm

function badCharacterSingleShiftTwo(context: Linter): RuleObjType {
  const charCode = 143;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - SINGLE SHIFT THREE.",
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

export default badCharacterSingleShiftTwo;
