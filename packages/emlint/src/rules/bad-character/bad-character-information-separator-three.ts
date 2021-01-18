import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-information-separator-three
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR THREE":
// https://www.fileformat.info/info/unicode/char/001d/index.htm

function badCharacterInformationSeparatorThree(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 29) {
        context.report({
          ruleId: "bad-character-information-separator-three",
          message: "Bad character - INFORMATION SEPARATOR THREE.",
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

export default badCharacterInformationSeparatorThree;
