import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-data-link-escape
// -----------------------------------------------------------------------------

// Catches raw character "DATA LINK ESCAPE":
// https://www.fileformat.info/info/unicode/char/0010/index.htm

function badCharacterDataLinkEscape(context: Linter): RuleObjType {
  let charCode = 16;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - DATA LINK ESCAPE.",
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

export default badCharacterDataLinkEscape;
