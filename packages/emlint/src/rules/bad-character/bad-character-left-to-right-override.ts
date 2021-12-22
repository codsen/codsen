import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-left-to-right-override
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT OVERRIDE":
// https://www.fileformat.info/info/unicode/char/202d/index.htm

function badCharacterLeftToRightOverride(context: Linter): RuleObjType {
  let charCode = 8237;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - LEFT-TO-RIGHT OVERRIDE.",
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

export default badCharacterLeftToRightOverride;
