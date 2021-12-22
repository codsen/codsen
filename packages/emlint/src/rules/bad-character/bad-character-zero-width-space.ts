import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-zero-width-space
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH SPACE":
// https://www.fileformat.info/info/unicode/char/200b/index.htm

function badCharacterZeroWidthSpace(context: Linter): RuleObjType {
  let charCode = 8203;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - ZERO WIDTH SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterZeroWidthSpace;
