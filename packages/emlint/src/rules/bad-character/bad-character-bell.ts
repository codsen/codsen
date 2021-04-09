import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-bell
// -----------------------------------------------------------------------------

// Catches raw character "BELL":
// https://www.fileformat.info/info/unicode/char/0007/index.htm

function badCharacterBell(context: Linter): RuleObjType {
  const charCode = 7;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - BELL.",
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

export default badCharacterBell;
