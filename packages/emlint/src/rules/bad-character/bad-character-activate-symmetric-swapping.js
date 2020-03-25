// rule: bad-character-activate-symmetric-swapping
// -----------------------------------------------------------------------------

// Catches raw character "INHIBIT SYMMETRIC SWAPPING":
// https://www.fileformat.info/info/unicode/char/206b/index.htm

function badCharacterActivateSymmetricSwapping(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8299) {
        context.report({
          ruleId: "bad-character-activate-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
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

export default badCharacterActivateSymmetricSwapping;
