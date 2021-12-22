import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-ideographic-space
// -----------------------------------------------------------------------------

// Catches raw character "IDEOGRAPHIC SPACE":
// https://www.fileformat.info/info/unicode/char/3000/index.htm

function badCharacterIdeographicSpace(context: Linter): RuleObjType {
  let charCode = 12288;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - IDEOGRAPHIC SPACE.",
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

export default badCharacterIdeographicSpace;
