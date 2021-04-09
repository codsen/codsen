import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-line-tabulation
// -----------------------------------------------------------------------------

// Catches raw character "LINE TABULATION":
// https://www.fileformat.info/info/unicode/char/000b/index.htm

function badCharacterLineTabulation(context: Linter): RuleObjType {
  const charCode = 11;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - LINE TABULATION.",
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

export default badCharacterLineTabulation;
