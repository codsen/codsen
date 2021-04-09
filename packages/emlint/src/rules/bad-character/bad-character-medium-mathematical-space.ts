import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-medium-mathematical-space
// -----------------------------------------------------------------------------

// Catches raw character "MEDIUM MATHEMATICAL SPACE":
// https://www.fileformat.info/info/unicode/char/205f/index.htm

function badCharacterMediumMathematicalSpace(context: Linter): RuleObjType {
  const charCode = 8287;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
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

export default badCharacterMediumMathematicalSpace;
