import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-paragraph-separator
// -----------------------------------------------------------------------------

// Catches raw character "PARAGRAPH SEPARATOR":
// https://www.fileformat.info/info/unicode/char/2029/index.htm

function badCharacterParagraphSeparator(context: Linter): RuleObjType {
  let charCode = 8233;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - PARAGRAPH SEPARATOR.",
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

export default badCharacterParagraphSeparator;
