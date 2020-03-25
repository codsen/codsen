// rule: bad-character-end-of-medium
// -----------------------------------------------------------------------------

// Catches raw character "END OF MEDIUM":
// https://www.fileformat.info/info/unicode/char/0019/index.htm

function badCharacterEndOfMedium(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 25) {
        context.report({
          ruleId: "bad-character-end-of-medium",
          message: "Bad character - END OF MEDIUM.",
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

export default badCharacterEndOfMedium;
