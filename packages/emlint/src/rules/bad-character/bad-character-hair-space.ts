import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-hair-space
// -----------------------------------------------------------------------------

// Catches raw character "HAIR SPACE":
// https://www.fileformat.info/info/unicode/char/200a/index.htm

function badCharacterHairSpace(context: Linter): RuleObjType {
  const charCode = 8202;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - HAIR SPACE.",
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

export default badCharacterHairSpace;
