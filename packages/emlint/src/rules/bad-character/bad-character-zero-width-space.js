// rule: bad-character-zero-width-space
// -----------------------------------------------------------------------------

// Catches raw character "ZERO WIDTH SPACE":
// https://www.fileformat.info/info/unicode/char/200b/index.htm

function badCharacterZeroWidthSpace(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8203) {
        context.report({
          ruleId: "bad-character-zero-width-space",
          message: "Bad character - ZERO WIDTH SPACE.",
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

export default badCharacterZeroWidthSpace;
