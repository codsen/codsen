import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-figure-space
// -----------------------------------------------------------------------------

// Catches raw character "FIGURE SPACE":
// https://www.fileformat.info/info/unicode/char/2007/index.htm

function badCharacterFigureSpace(context: Linter): RuleObjType {
  const charCode = 8199;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - FIGURE SPACE.",
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

export default badCharacterFigureSpace;
