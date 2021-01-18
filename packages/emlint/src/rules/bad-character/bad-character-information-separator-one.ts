import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-information-separator-one
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR ONE":
// https://www.fileformat.info/info/unicode/char/001f/index.htm

function badCharacterInformationSeparatorTwo(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 31) {
        context.report({
          ruleId: "bad-character-information-separator-one",
          message: "Bad character - INFORMATION SEPARATOR ONE.",
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

export default badCharacterInformationSeparatorTwo;
