import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-end-of-text
// -----------------------------------------------------------------------------

// Catches raw character "END OF TEXT":
// https://www.fileformat.info/info/unicode/char/0003/index.htm

function badCharacterEndOfText(context: Linter): RuleObjType {
  let charCode = 3;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - END OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, "\n"]], // replace with line break
          },
        });
      }
    },
  };
}

export default badCharacterEndOfText;
