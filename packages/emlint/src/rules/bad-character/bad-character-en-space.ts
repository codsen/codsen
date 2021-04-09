import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-en-space
// -----------------------------------------------------------------------------

// Catches raw character "EN SPACE":
// https://www.fileformat.info/info/unicode/char/2002/index.htm

function badCharacterEnSpace(context: Linter): RuleObjType {
  const charCode = 8194;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - EN SPACE.",
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

export default badCharacterEnSpace;
