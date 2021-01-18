import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-figure-space
// -----------------------------------------------------------------------------

// Catches raw character "FIGURE SPACE":
// https://www.fileformat.info/info/unicode/char/2007/index.htm

function badCharacterFigureSpace(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8199) {
        context.report({
          ruleId: "bad-character-figure-space",
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
