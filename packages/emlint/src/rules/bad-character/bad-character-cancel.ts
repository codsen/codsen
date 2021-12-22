import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-cancel
// -----------------------------------------------------------------------------

// Catches raw character "CANCEL":
// https://www.fileformat.info/info/unicode/char/0018/index.htm

function badCharacterCancel(context: Linter): RuleObjType {
  let charCode = 24;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - CANCEL.",
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

export default badCharacterCancel;
