// rule: bad-character-thin-space
// -----------------------------------------------------------------------------

// Catches raw character "THIN SPACE":
// https://www.fileformat.info/info/unicode/char/2009/index.htm

function badCharacterThinSpace(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8201) {
        context.report({
          ruleId: "bad-character-thin-space",
          message: "Bad character - THIN SPACE.",
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

export default badCharacterThinSpace;
