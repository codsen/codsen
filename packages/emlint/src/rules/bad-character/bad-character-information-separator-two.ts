import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-information-separator-two
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR TWO":
// https://www.fileformat.info/info/unicode/char/001e/index.htm

function badCharacterInformationSeparatorTwo(context: Linter): RuleObjType {
  let charCode = 30;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INFORMATION SEPARATOR TWO.",
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
