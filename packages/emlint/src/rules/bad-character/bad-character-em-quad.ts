import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-em-quad
// -----------------------------------------------------------------------------

// Catches raw character "EM QUAD":
// https://www.fileformat.info/info/unicode/char/2001/index.htm

function badCharacterEmQuad(context: Linter): RuleObjType {
  let charCode = 8193;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - EM QUAD.",
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

export default badCharacterEmQuad;
