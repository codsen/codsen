import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-null
// -----------------------------------------------------------------------------

// Catches raw character "NULL":
// https://www.fileformat.info/info/unicode/char/0000/index.htm

function badCharacterNull(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 0) {
        context.report({
          ruleId: "bad-character-null",
          message: "Bad character - NULL.",
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

export default badCharacterNull;
