// rule: bad-character-non-breaking-space
// -----------------------------------------------------------------------------

// Catches raw character "NON-BREAKING SPACE":
// https://www.fileformat.info/info/unicode/char/00a0/index.htm

function badCharacterNonBreakingSpace(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 160) {
        context.report({
          ruleId: "bad-character-non-breaking-space",
          message: "Bad character - NON-BREAKING SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterNonBreakingSpace;
