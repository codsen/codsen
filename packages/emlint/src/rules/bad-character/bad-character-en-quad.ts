import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-en-quad
// -----------------------------------------------------------------------------

// Catches raw character "EN QUAD":
// https://www.fileformat.info/info/unicode/char/2000/index.htm

function badCharacterEnQuad(context: Linter): RuleObjType {
  const charCode = 8192;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - EN QUAD.",
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

export default badCharacterEnQuad;
