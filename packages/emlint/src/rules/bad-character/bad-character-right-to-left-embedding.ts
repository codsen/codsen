import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-right-to-left-embedding
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT EMBEDDING":
// https://www.fileformat.info/info/unicode/char/202b/index.htm

function badCharacterRightToLeftEmbedding(context: Linter): RuleObjType {
  let charCode = 8235;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
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

export default badCharacterRightToLeftEmbedding;
