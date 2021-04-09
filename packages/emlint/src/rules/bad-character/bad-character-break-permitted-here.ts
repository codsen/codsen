import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-break-permitted-here
// -----------------------------------------------------------------------------

// Catches raw character "BREAK PERMITTED HERE":
// https://www.fileformat.info/info/unicode/char/0082/index.htm

function badCharacterBreakPermittedHere(context: Linter): RuleObjType {
  const charCode = 130;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - BREAK PERMITTED HERE.",
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

export default badCharacterBreakPermittedHere;
