import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-private-message
// -----------------------------------------------------------------------------

// Catches raw character "PRIVATE MESSAGE":
// https://www.fileformat.info/info/unicode/char/009e/index.htm

function badCharacterPrivateMessage(context: Linter): RuleObjType {
  let charCode = 158;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - PRIVATE MESSAGE.",
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

export default badCharacterPrivateMessage;
