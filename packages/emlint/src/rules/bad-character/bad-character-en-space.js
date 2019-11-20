// rule: bad-character-en-space
// -----------------------------------------------------------------------------

// Catches raw character "EN SPACE":
// https://www.fileformat.info/info/unicode/char/2002/index.htm

function badCharacterEnSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8194) {
        context.report({
          ruleId: "bad-character-en-space",
          message: "Bad character - EN SPACE.",
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

export default badCharacterEnSpace;
