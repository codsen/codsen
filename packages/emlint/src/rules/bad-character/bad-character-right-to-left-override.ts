import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-right-to-left-override
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT OVERRIDE":
// https://www.fileformat.info/info/unicode/char/202e/index.htm

function badCharacterRightToLeftOverride(context: Linter): RuleObjType {
  const charCode = 8238;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - RIGHT-TO-LEFT OVERRIDE.",
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

export default badCharacterRightToLeftOverride;
