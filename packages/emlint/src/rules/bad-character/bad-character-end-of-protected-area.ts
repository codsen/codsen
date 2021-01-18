import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-end-of-protected-area
// -----------------------------------------------------------------------------

// Catches raw character "END OF PROTECTED AREA":
// https://www.fileformat.info/info/unicode/char/0097/index.htm

function badCharacterEndOfProtectedArea(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 151) {
        context.report({
          ruleId: "bad-character-end-of-protected-area",
          message: "Bad character - END OF PROTECTED AREA.",
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

export default badCharacterEndOfProtectedArea;
