import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-private-use-2
// -----------------------------------------------------------------------------

// Catches raw character "PRIVATE USE TWO":
// https://www.fileformat.info/info/unicode/char/0092/index.htm

function badCharacterPrivateUseTwo(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 146) {
        context.report({
          ruleId: "bad-character-private-use-2",
          message: "Bad character - PRIVATE USE TWO.",
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

export default badCharacterPrivateUseTwo;
