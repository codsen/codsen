import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-end-of-selected-area
// -----------------------------------------------------------------------------

// Catches raw character "END OF SELECTED AREA":
// https://www.fileformat.info/info/unicode/char/0087/index.htm

function badCharacterEndOfSelectedArea(context: Linter): RuleObjType {
  let charCode = 135;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - END OF SELECTED AREA.",
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

export default badCharacterEndOfSelectedArea;
