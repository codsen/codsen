import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-activate-arabic-form-shaping
// -----------------------------------------------------------------------------

// Catches raw character "ACTIVATE ARABIC FORM SHAPING":
// https://www.fileformat.info/info/unicode/char/206d/index.htm

function badCharacterActivateArabicFormShaping(context: Linter): RuleObjType {
  let charCode = 8301;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - ACTIVATE ARABIC FORM SHAPING.",
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

export default badCharacterActivateArabicFormShaping;
