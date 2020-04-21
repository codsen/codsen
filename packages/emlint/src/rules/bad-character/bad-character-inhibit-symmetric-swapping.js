// rule: bad-character-inhibit-symmetric-swapping
// -----------------------------------------------------------------------------

// Catches raw character "INHIBIT SYMMETRIC SWAPPING":
// https://www.fileformat.info/info/unicode/char/206a/index.htm

function badCharacterInhibitSymmetricSwapping(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8298) {
        context.report({
          ruleId: "bad-character-inhibit-symmetric-swapping",
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

export default badCharacterInhibitSymmetricSwapping;
