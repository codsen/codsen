// rule: bad-character-right-to-left-override
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT OVERRIDE":
// https://www.fileformat.info/info/unicode/char/202e/index.htm

function badCharacterRightToLeftOverride(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8238) {
        context.report({
          ruleId: "bad-character-right-to-left-override",
          message: "Bad character - RIGHT-TO-LEFT OVERRIDE.",
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

export default badCharacterRightToLeftOverride;
