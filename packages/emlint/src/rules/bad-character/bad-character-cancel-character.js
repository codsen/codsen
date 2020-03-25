// rule: bad-character-cancel-character
// -----------------------------------------------------------------------------

// Catches raw character "CANCEL CHARACTER":
// https://www.fileformat.info/info/unicode/char/0094/index.htm

function badCharacterCancelCharacter(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 148) {
        context.report({
          ruleId: "bad-character-cancel-character",
          message: "Bad character - CANCEL CHARACTER.",
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

export default badCharacterCancelCharacter;
