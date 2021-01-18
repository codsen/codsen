import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-no-break-here
// -----------------------------------------------------------------------------

// Catches raw character "NO BREAK HERE":
// https://www.fileformat.info/info/unicode/char/0083/index.htm

function badCharacterNoBreakHere(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 131) {
        context.report({
          ruleId: "bad-character-no-break-here",
          message: "Bad character - NO BREAK HERE.",
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

export default badCharacterNoBreakHere;
