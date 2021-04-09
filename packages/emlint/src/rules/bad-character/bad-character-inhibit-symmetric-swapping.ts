import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-inhibit-symmetric-swapping
// -----------------------------------------------------------------------------

// Catches raw character "INHIBIT SYMMETRIC SWAPPING":
// https://www.fileformat.info/info/unicode/char/206a/index.htm

function badCharacterInhibitSymmetricSwapping(context: Linter): RuleObjType {
  const charCode = 8298;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
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

export default badCharacterInhibitSymmetricSwapping;
