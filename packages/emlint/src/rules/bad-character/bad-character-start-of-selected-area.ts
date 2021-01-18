import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-start-of-selected-area
// -----------------------------------------------------------------------------

// Catches raw character "START OF SELECTED AREA":
// https://www.fileformat.info/info/unicode/char/0086/index.htm

function badCharacterStartOfSelectedArea(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 134) {
        context.report({
          ruleId: "bad-character-start-of-selected-area",
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
