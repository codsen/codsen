import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-hair-space
// -----------------------------------------------------------------------------

// Catches raw character "HAIR SPACE":
// https://www.fileformat.info/info/unicode/char/200a/index.htm

function badCharacterHairSpace(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8202) {
        context.report({
          ruleId: "bad-character-hair-space",
          message: "Bad character - HAIR SPACE.",
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

export default badCharacterHairSpace;
