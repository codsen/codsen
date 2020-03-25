// rule: bad-character-six-per-em-space
// -----------------------------------------------------------------------------

// Catches raw character "SIX-PER-EM SPACE":
// https://www.fileformat.info/info/unicode/char/2006/index.htm

function badCharacterSixPerEmSpace(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8198) {
        context.report({
          ruleId: "bad-character-six-per-em-space",
          message: "Bad character - SIX-PER-EM SPACE.",
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

export default badCharacterSixPerEmSpace;
