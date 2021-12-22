import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-inhibit-arabic-form-shaping
// -----------------------------------------------------------------------------

// Catches raw character "INHIBIT ARABIC FORM SHAPING":
// https://www.fileformat.info/info/unicode/char/206c/index.htm

function badCharacterInhibitArabicFormShaping(context: Linter): RuleObjType {
  let charCode = 8300;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INHIBIT ARABIC FORM SHAPING.",
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

export default badCharacterInhibitArabicFormShaping;
