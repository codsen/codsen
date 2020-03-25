// rule: bad-character-replacement-character
// -----------------------------------------------------------------------------

// Catches raw character "REPLACEMENT CHARACTER":
// https://www.fileformat.info/info/unicode/char/fffd/index.htm

function badCharacterReplacementCharacter(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 65533) {
        context.report({
          ruleId: "bad-character-replacement-character",
          message: "Bad character - REPLACEMENT CHARACTER.",
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

export default badCharacterReplacementCharacter;
