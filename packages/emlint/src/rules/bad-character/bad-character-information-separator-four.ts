import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-information-separator-four
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR FOUR":
// https://www.fileformat.info/info/unicode/char/001c/index.htm

function badCharacterInformationSeparatorFour(context: Linter): RuleObjType {
  let charCode = 28;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INFORMATION SEPARATOR FOUR.",
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

export default badCharacterInformationSeparatorFour;
