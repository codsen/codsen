import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-non-breaking-space
// -----------------------------------------------------------------------------

// Catches raw character "NON-BREAKING SPACE":
// https://www.fileformat.info/info/unicode/char/00a0/index.htm

function badCharacterNonBreakingSpace(context: Linter): RuleObjType {
  let charCode = 160;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - NON-BREAKING SPACE.",
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

export default badCharacterNonBreakingSpace;
