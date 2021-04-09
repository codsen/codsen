import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-thin-space
// -----------------------------------------------------------------------------

// Catches raw character "THIN SPACE":
// https://www.fileformat.info/info/unicode/char/2009/index.htm

function badCharacterThinSpace(context: Linter): RuleObjType {
  const charCode = 8201;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - THIN SPACE.",
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

export default badCharacterThinSpace;
