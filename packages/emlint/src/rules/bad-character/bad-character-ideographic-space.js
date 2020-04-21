// rule: bad-character-ideographic-space
// -----------------------------------------------------------------------------

// Catches raw character "IDEOGRAPHIC SPACE":
// https://www.fileformat.info/info/unicode/char/3000/index.htm

function badCharacterIdeographicSpace(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 12288) {
        context.report({
          ruleId: "bad-character-ideographic-space",
          message: "Bad character - IDEOGRAPHIC SPACE.",
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

export default badCharacterIdeographicSpace;
