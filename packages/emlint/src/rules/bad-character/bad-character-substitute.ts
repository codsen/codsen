import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-substitute
// -----------------------------------------------------------------------------

// Catches raw character "SUBSTITUTE":
// https://www.fileformat.info/info/unicode/char/001a/index.htm

function badCharacterSubstitute(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 26) {
        context.report({
          ruleId: "bad-character-substitute",
          message: "Bad character - SUBSTITUTE.",
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

export default badCharacterSubstitute;
