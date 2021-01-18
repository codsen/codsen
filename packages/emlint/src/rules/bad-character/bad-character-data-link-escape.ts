import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-data-link-escape
// -----------------------------------------------------------------------------

// Catches raw character "DATA LINK ESCAPE":
// https://www.fileformat.info/info/unicode/char/0010/index.htm

function badCharacterDataLinkEscape(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 16) {
        context.report({
          ruleId: "bad-character-data-link-escape",
          message: "Bad character - DATA LINK ESCAPE.",
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

export default badCharacterDataLinkEscape;
