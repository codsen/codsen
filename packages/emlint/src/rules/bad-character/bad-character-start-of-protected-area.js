// rule: bad-character-start-of-protected-area
// -----------------------------------------------------------------------------

// Catches raw character "START OF PROTECTED AREA":
// https://www.fileformat.info/info/unicode/char/0096/index.htm

function badCharacterStartOfProtectedArea(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 150) {
        context.report({
          ruleId: "bad-character-start-of-protected-area",
          message: "Bad character - START OF PROTECTED AREA.",
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

export default badCharacterStartOfProtectedArea;
