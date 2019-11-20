// rule: bad-character-four-per-em-space
// -----------------------------------------------------------------------------

// Catches raw character "FOUR-PER-EM SPACE":
// https://www.fileformat.info/info/unicode/char/2005/index.htm

function badCharacterFourPerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8197) {
        context.report({
          ruleId: "bad-character-four-per-em-space",
          message: "Bad character - FOUR-PER-EM SPACE.",
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

export default badCharacterFourPerEmSpace;
