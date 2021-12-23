import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-six-per-em-space
// -----------------------------------------------------------------------------

// Catches raw character "SIX-PER-EM SPACE":
// https://www.fileformat.info/info/unicode/char/2006/index.htm

function badCharacterSixPerEmSpace(context: Linter): RuleObjType {
  let charCode = 8198;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - SIX-PER-EM SPACE.",
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

export default badCharacterSixPerEmSpace;
