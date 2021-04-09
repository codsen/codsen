import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-form-feed
// -----------------------------------------------------------------------------

// Catches raw character "FORM FEED":
// https://www.fileformat.info/info/unicode/char/000c/index.htm

function badCharacterFormFeed(context: Linter): RuleObjType {
  const charCode = 12;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - FORM FEED.",
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

export default badCharacterFormFeed;
