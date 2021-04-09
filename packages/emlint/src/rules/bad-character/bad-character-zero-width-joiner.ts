import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-zero-width-joiner
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH JOINER":
// https://www.fileformat.info/info/unicode/char/200d/index.htm

function badCharacterZeroWidthJoiner(context: Linter): RuleObjType {
  const charCode = 8205;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - ZERO WIDTH JOINER.",
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

export default badCharacterZeroWidthJoiner;
