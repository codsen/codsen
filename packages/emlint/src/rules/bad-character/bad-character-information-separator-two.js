// rule: bad-character-information-separator-two
// -----------------------------------------------------------------------------

// Catches raw character "INFORMATION SEPARATOR TWO":
// https://www.fileformat.info/info/unicode/char/001e/index.htm

function badCharacterInformationSeparatorTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 30) {
        context.report({
          ruleId: "bad-character-information-separator-two",
          message: "Bad character - INFORMATION SEPARATOR TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]] // just delete it
          }
        });
      }
    }
  };
}

export default badCharacterInformationSeparatorTwo;
