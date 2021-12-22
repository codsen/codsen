import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-nominal-digit-shapes
// -----------------------------------------------------------------------------

// Catches raw character "NOMINAL DIGIT SHAPES":
// https://www.fileformat.info/info/unicode/char/206f/index.htm

function badCharacterNominalDigitShapes(context: Linter): RuleObjType {
  let charCode = 8303;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
