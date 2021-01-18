import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-end-of-transmission
// -----------------------------------------------------------------------------

// Catches raw character "END OF TRANSMISSION":
// https://www.fileformat.info/info/unicode/char/0004/index.htm

function badCharacterEndOfTransmission(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 4) {
        context.report({
          ruleId: "bad-character-end-of-transmission",
          message: "Bad character - END OF TRANSMISSION.",
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

export default badCharacterEndOfTransmission;
