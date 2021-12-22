import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-four-per-em-space
// -----------------------------------------------------------------------------

// Catches raw character "FOUR-PER-EM SPACE":
// https://www.fileformat.info/info/unicode/char/2005/index.htm

function badCharacterFourPerEmSpace(context: Linter): RuleObjType {
  let charCode = 8197;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - FOUR-PER-EM SPACE.",
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

export default badCharacterFourPerEmSpace;
