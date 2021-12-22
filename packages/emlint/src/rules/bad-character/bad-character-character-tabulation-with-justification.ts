import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-character-tabulation-with-justification
// -----------------------------------------------------------------------------

// Catches raw character "CHARACTER TABULATION WITH JUSTIFICATION":
// https://www.fileformat.info/info/unicode/char/0089/index.htm

function badCharacterCharacterTabulationWithJustification(
  context: Linter
): RuleObjType {
  let charCode = 137;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - CHARACTER TABULATION WITH JUSTIFICATION.",
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

export default badCharacterCharacterTabulationWithJustification;
