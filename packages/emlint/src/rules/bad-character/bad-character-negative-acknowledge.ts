import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-negative-acknowledge
// -----------------------------------------------------------------------------

// Catches raw character "NEGATIVE ACKNOWLEDGE":
// https://www.fileformat.info/info/unicode/char/0015/index.htm

function badCharacterNegativeAcknowledge(context: Linter): RuleObjType {
  const charCode = 21;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - NEGATIVE ACKNOWLEDGE.",
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

export default badCharacterNegativeAcknowledge;
