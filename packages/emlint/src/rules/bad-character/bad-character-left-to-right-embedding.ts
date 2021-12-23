import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-left-to-right-embedding
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT EMBEDDING":
// https://www.fileformat.info/info/unicode/char/202a/index.htm

function badCharacterLeftToRightEmbedding(context: Linter): RuleObjType {
  let charCode = 8234;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
