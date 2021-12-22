import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-no-break-here
// -----------------------------------------------------------------------------

// Catches raw character "NO BREAK HERE":
// https://www.fileformat.info/info/unicode/char/0083/index.htm

function badCharacterNoBreakHere(context: Linter): RuleObjType {
  let charCode = 131;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - NO BREAK HERE.",
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

export default badCharacterNoBreakHere;
