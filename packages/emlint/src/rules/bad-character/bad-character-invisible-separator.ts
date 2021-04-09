import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-invisible-separator
// -----------------------------------------------------------------------------

// Catches raw character "INVISIBLE SEPARATOR":
// https://www.fileformat.info/info/unicode/char/2063/index.htm

function badCharacterInvisibleSeparator(context: Linter): RuleObjType {
  const charCode = 8291;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INVISIBLE SEPARATOR.",
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

export default badCharacterInvisibleSeparator;
