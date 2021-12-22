import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-synchronous-idle
// -----------------------------------------------------------------------------

// Catches raw character "SYNCHRONOUS IDLE":
// https://www.fileformat.info/info/unicode/char/0016/index.htm

function badCharacterSynchronousIdle(context: Linter): RuleObjType {
  let charCode = 22;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
