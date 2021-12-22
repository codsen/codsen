import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-start-of-heading
// -----------------------------------------------------------------------------

// Catches raw character "START OF HEADING":
// https://www.fileformat.info/info/unicode/char/0001/index.htm

function badCharacterStartOfHeading(context: Linter): RuleObjType {
  let charCode = 1;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - START OF HEADING.",
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

export default badCharacterStartOfHeading;
