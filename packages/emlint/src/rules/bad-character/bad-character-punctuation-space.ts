import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-punctuation-space
// -----------------------------------------------------------------------------

// Catches raw character "PUNCTUATION SPACE":
// https://www.fileformat.info/info/unicode/char/2008/index.htm

function badCharacterPunctuationSpace(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8200) {
        context.report({
          ruleId: "bad-character-punctuation-space",
          message: "Bad character - PUNCTUATION SPACE.",
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

export default badCharacterPunctuationSpace;
