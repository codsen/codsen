import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-shift-out
// -----------------------------------------------------------------------------

// Catches raw character "SHIFT OUT":
// https://www.fileformat.info/info/unicode/char/000e/index.htm

function badCharacterShiftOut(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 14) {
        context.report({
          ruleId: "bad-character-shift-out",
          message: "Bad character - SHIFT OUT.",
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

export default badCharacterShiftOut;
