import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-em-quad
// -----------------------------------------------------------------------------

// Catches raw character "EM QUAD":
// https://www.fileformat.info/info/unicode/char/2001/index.htm

function badCharacterEmQuad(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8193) {
        context.report({
          ruleId: "bad-character-em-quad",
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
