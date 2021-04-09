import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-end-of-protected-area
// -----------------------------------------------------------------------------

// Catches raw character "END OF PROTECTED AREA":
// https://www.fileformat.info/info/unicode/char/0097/index.htm

function badCharacterEndOfProtectedArea(context: Linter): RuleObjType {
  const charCode = 151;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - END OF PROTECTED AREA.",
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

export default badCharacterEndOfProtectedArea;
