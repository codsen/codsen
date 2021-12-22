import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-zero-width-non-joiner
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH NON-JOINER":
// https://www.fileformat.info/info/unicode/char/200c/index.htm

function badCharacterZeroWidthNonJoiner(context: Linter): RuleObjType {
  let charCode = 8204;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - ZERO WIDTH NON-JOINER.",
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

export default badCharacterZeroWidthNonJoiner;
