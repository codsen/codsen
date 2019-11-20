// rule: bad-character-em-space
// -----------------------------------------------------------------------------

// Catches raw character "EM SPACE":
// https://www.fileformat.info/info/unicode/char/2003/index.htm

function badCharacterEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8195) {
        context.report({
          ruleId: "bad-character-em-space",
          message: "Bad character - EM SPACE.",
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

export default badCharacterEmSpace;
