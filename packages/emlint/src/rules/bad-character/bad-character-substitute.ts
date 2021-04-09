import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-substitute
// -----------------------------------------------------------------------------

// Catches raw character "SUBSTITUTE":
// https://www.fileformat.info/info/unicode/char/001a/index.htm

function badCharacterSubstitute(context: Linter): RuleObjType {
  const charCode = 26;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - SUBSTITUTE.",
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

export default badCharacterSubstitute;
