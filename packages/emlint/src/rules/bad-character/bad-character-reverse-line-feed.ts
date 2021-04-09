import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-reverse-line-feed
// -----------------------------------------------------------------------------

// Catches raw character "REVERSE LINE FEED":
// https://www.fileformat.info/info/unicode/char/008d/index.htm

function badCharacterReverseLineFeed(context: Linter): RuleObjType {
  const charCode = 141;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - REVERSE LINE FEED.",
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

export default badCharacterReverseLineFeed;
