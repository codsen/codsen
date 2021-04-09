import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-start-of-protected-area
// -----------------------------------------------------------------------------

// Catches raw character "START OF PROTECTED AREA":
// https://www.fileformat.info/info/unicode/char/0096/index.htm

function badCharacterStartOfProtectedArea(context: Linter): RuleObjType {
  const charCode = 150;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - START OF PROTECTED AREA.",
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

export default badCharacterStartOfProtectedArea;
