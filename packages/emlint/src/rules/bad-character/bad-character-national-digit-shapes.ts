import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-national-digit-shapes
// -----------------------------------------------------------------------------

// Catches raw character "NATIONAL DIGIT SHAPES":
// https://www.fileformat.info/info/unicode/char/206e/index.htm

function badCharacterNationalDigitShapes(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8302) {
        context.report({
          ruleId: "bad-character-national-digit-shapes",
          message: "Bad character - NATIONAL DIGIT SHAPES.",
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

export default badCharacterNationalDigitShapes;
