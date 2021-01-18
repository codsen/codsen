import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-synchronous-idle
// -----------------------------------------------------------------------------

// Catches raw character "SYNCHRONOUS IDLE":
// https://www.fileformat.info/info/unicode/char/0016/index.htm

function badCharacterSynchronousIdle(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 22) {
        context.report({
          ruleId: "bad-character-synchronous-idle",
          message: "Bad character - SYNCHRONOUS IDLE.",
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

export default badCharacterSynchronousIdle;
