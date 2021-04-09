import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-partial-line-forward
// -----------------------------------------------------------------------------

// Catches raw character "PARTIAL LINE FORWARD":
// https://www.fileformat.info/info/unicode/char/008b/index.htm

function badCharacterPartialLineForward(context: Linter): RuleObjType {
  const charCode = 139;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - PARTIAL LINE FORWARD.",
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

export default badCharacterPartialLineForward;
