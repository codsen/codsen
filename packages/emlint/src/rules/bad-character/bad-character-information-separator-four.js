// rule: bad-character-information-separator-four
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR FOUR":
// https://www.fileformat.info/info/unicode/char/001c/index.htm

function badCharacterInformationSeparatorFour(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 28) {
        context.report({
          ruleId: "bad-character-information-separator-four",
          message: "Bad character - INFORMATION SEPARATOR FOUR.",
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

export default badCharacterInformationSeparatorFour;
