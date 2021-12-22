import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-start-of-selected-area
// -----------------------------------------------------------------------------

// Catches raw character "START OF SELECTED AREA":
// https://www.fileformat.info/info/unicode/char/0086/index.htm

function badCharacterStartOfSelectedArea(context: Linter): RuleObjType {
  let charCode = 134;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - START OF SELECTED AREA.",
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

export default badCharacterStartOfSelectedArea;
