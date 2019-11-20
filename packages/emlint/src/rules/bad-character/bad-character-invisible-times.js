// rule: bad-character-invisible-times
// -----------------------------------------------------------------------------

// Catches raw character "INVISIBLE TIMES":
// https://www.fileformat.info/info/unicode/char/2062/index.htm

function badCharacterInvisibleTimes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8290) {
        context.report({
          ruleId: "bad-character-invisible-times",
          message: "Bad character - INVISIBLE TIMES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]] // just delete it
          }
        });
      }
    }
  };
}

export default badCharacterInvisibleTimes;
