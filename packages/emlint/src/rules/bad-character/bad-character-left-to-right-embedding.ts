import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-left-to-right-embedding
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT EMBEDDING":
// https://www.fileformat.info/info/unicode/char/202a/index.htm

function badCharacterLeftToRightEmbedding(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8234) {
        context.report({
          ruleId: "bad-character-left-to-right-embedding",
          message: "Bad character - LEFT-TO-RIGHT EMBEDDING.",
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

export default badCharacterLeftToRightEmbedding;
