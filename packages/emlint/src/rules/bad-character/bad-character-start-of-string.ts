import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-start-of-string
// -----------------------------------------------------------------------------

// Catches raw character "START OF STRING":
// https://www.fileformat.info/info/unicode/char/0098/index.htm

function badCharacterStartOfString(context: Linter): RuleObjType {
  const charCode = 152;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - START OF STRING.",
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

export default badCharacterStartOfString;
