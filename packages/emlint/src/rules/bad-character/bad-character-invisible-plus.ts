import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-invisible-plus
// -----------------------------------------------------------------------------

// Catches raw character "INVISIBLE PLUS":
// https://www.fileformat.info/info/unicode/char/2064/index.htm

function badCharacterInvisiblePlus(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8292) {
        context.report({
          ruleId: "bad-character-invisible-plus",
          message: "Bad character - INVISIBLE PLUS.",
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

export default badCharacterInvisiblePlus;
