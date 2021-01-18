import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-backspace
// -----------------------------------------------------------------------------

// Catches raw character "BACKSPACE":
// https://www.fileformat.info/info/unicode/char/0008/index.htm

function badCharacterBackspace(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8) {
        context.report({
          ruleId: "bad-character-backspace",
          message: "Bad character - BACKSPACE.",
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

export default badCharacterBackspace;
