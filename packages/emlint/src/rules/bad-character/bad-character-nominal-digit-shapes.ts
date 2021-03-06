import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-nominal-digit-shapes
// -----------------------------------------------------------------------------

// Catches raw character "NOMINAL DIGIT SHAPES":
// https://www.fileformat.info/info/unicode/char/206f/index.htm

function badCharacterNominalDigitShapes(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8303) {
        context.report({
          ruleId: "bad-character-nominal-digit-shapes",
          message: "Bad character - NOMINAL DIGIT SHAPES.",
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

export default badCharacterNominalDigitShapes;
