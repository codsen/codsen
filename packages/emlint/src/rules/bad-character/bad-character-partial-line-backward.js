// rule: bad-character-partial-line-backward
// -----------------------------------------------------------------------------

// Catches raw character "PARTIAL LINE BACKWARD":
// https://www.fileformat.info/info/unicode/char/008c/index.htm

function badCharacterPartialLineBackward(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 140) {
        context.report({
          ruleId: "bad-character-partial-line-backward",
          message: "Bad character - PARTIAL LINE BACKWARD.",
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

export default badCharacterPartialLineBackward;
