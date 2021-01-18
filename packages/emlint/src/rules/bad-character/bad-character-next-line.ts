import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-next-line
// -----------------------------------------------------------------------------

// Catches raw character "NEXT LINE":
// https://www.fileformat.info/info/unicode/char/0085/index.htm

function badCharacterNextLine(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 133) {
        context.report({
          ruleId: "bad-character-next-line",
          message: "Bad character - NEXT LINE.",
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

export default badCharacterNextLine;
