import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-punctuation-space
// -----------------------------------------------------------------------------

// Catches raw character "PUNCTUATION SPACE":
// https://www.fileformat.info/info/unicode/char/2008/index.htm

function badCharacterPunctuationSpace(context: Linter): RuleObjType {
  let charCode = 8200;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - PUNCTUATION SPACE.",
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

export default badCharacterPunctuationSpace;
