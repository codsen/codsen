import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-end-of-text
// -----------------------------------------------------------------------------

// Catches raw character "END OF TEXT":
// https://www.fileformat.info/info/unicode/char/0003/index.htm

function badCharacterEndOfText(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 3) {
        context.report({
          ruleId: "bad-character-end-of-text",
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
