// rule: bad-character-zero-width-non-joiner
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH NON-JOINER":
// https://www.fileformat.info/info/unicode/char/200c/index.htm

function badCharacterZeroWidthNonJoiner(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8204) {
        context.report({
          ruleId: "bad-character-zero-width-non-joiner",
          message: "Bad character - ZERO WIDTH NON-JOINER.",
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

export default badCharacterZeroWidthNonJoiner;
