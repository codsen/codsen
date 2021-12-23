import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-escape
// -----------------------------------------------------------------------------

// Catches raw character "ESCAPE":
// https://www.fileformat.info/info/unicode/char/001b/index.htm

function badCharacterEscape(context: Linter): RuleObjType {
  let charCode = 27;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - ESCAPE.",
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

export default badCharacterEscape;
