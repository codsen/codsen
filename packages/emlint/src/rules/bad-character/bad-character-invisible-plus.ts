import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-invisible-plus
// -----------------------------------------------------------------------------

// Catches raw character "INVISIBLE PLUS":
// https://www.fileformat.info/info/unicode/char/2064/index.htm

function badCharacterInvisiblePlus(context: Linter): RuleObjType {
  const charCode = 8292;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INVISIBLE PLUS.",
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

export default badCharacterInvisiblePlus;
