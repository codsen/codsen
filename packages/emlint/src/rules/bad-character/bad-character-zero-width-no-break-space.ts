import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-zero-width-no-break-space
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH NO-BREAK SPACE":
// https://www.fileformat.info/info/unicode/char/feff/index.htm

function badCharacterZeroWidthNoBreakSpace(context: Linter): RuleObjType {
  let charCode = 65279;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - ZERO WIDTH NO-BREAK SPACE.",
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

export default badCharacterZeroWidthNoBreakSpace;
