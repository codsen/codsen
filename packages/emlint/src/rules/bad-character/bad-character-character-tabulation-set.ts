import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-character-tabulation-set
// -----------------------------------------------------------------------------

// Catches raw character "CHARACTER TABULATION SET":
// https://www.fileformat.info/info/unicode/char/0088/index.htm

function badCharacterCharacterTabulationSet(context: Linter): RuleObjType {
  const charCode = 136;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - CHARACTER TABULATION SET.",
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

export default badCharacterCharacterTabulationSet;
