// rule: bad-character-zero-width-no-break-space
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH NO-BREAK SPACE":
// https://www.fileformat.info/info/unicode/char/feff/index.htm

function badCharacterZeroWidthNoBreakSpace(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 65279) {
        context.report({
          ruleId: "bad-character-zero-width-no-break-space",
          message: "Bad character - ZERO WIDTH NO-BREAK SPACE.",
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

export default badCharacterZeroWidthNoBreakSpace;
