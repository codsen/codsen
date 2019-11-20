// rule: bad-character-medium-mathematical-space
// -----------------------------------------------------------------------------

// Catches raw character "MEDIUM MATHEMATICAL SPACE":
// https://www.fileformat.info/info/unicode/char/205f/index.htm

function badCharacterMediumMathematicalSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8287) {
        context.report({
          ruleId: "bad-character-medium-mathematical-space",
          message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]] // replace with a normal space
          }
        });
      }
    }
  };
}

export default badCharacterMediumMathematicalSpace;
