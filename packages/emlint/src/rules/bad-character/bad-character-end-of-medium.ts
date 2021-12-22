import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-end-of-medium
// -----------------------------------------------------------------------------

// Catches raw character "END OF MEDIUM":
// https://www.fileformat.info/info/unicode/char/0019/index.htm

function badCharacterEndOfMedium(context: Linter): RuleObjType {
  let charCode = 25;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - END OF MEDIUM.",
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

export default badCharacterEndOfMedium;
