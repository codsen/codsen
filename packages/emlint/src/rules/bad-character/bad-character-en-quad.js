// rule: bad-character-en-quad
// -----------------------------------------------------------------------------

// Catches raw character "EN QUAD":
// https://www.fileformat.info/info/unicode/char/2000/index.htm

function badCharacterEnQuad(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8192) {
        context.report({
          ruleId: "bad-character-en-quad",
          message: "Bad character - EN QUAD.",
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

export default badCharacterEnQuad;
