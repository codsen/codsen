import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-narrow-no-break-space
// -----------------------------------------------------------------------------

// Catches raw character "NARROW NO-BREAK SPACE":
// https://www.fileformat.info/info/unicode/char/202f/index.htm

function badCharacterNarrowNoBreakSpace(context: Linter): RuleObjType {
  let charCode = 8239;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - NARROW NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterNarrowNoBreakSpace;
