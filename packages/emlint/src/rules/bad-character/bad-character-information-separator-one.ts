import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-information-separator-one
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR ONE":
// https://www.fileformat.info/info/unicode/char/001f/index.htm

function badCharacterInformationSeparatorTwo(context: Linter): RuleObjType {
  let charCode = 31;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INFORMATION SEPARATOR ONE.",
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

export default badCharacterInformationSeparatorTwo;
