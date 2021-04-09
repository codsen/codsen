import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-invisible-times
// -----------------------------------------------------------------------------

// Catches raw character "INVISIBLE TIMES":
// https://www.fileformat.info/info/unicode/char/2062/index.htm

function badCharacterInvisibleTimes(context: Linter): RuleObjType {
  const charCode = 8290;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INVISIBLE TIMES.",
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

export default badCharacterInvisibleTimes;
