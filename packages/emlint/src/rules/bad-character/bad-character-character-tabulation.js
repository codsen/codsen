// rule: bad-character-character-tabulation
// -----------------------------------------------------------------------------

// Catches raw character "TABULATION" or simply "TAB":
// https://www.fileformat.info/info/unicode/char/0009/index.htm

function badCharacterTabulation(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 9) {
        context.report({
          ruleId: "bad-character-character-tabulation",
          message: "Bad character - TABULATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]] // replace with one space
          }
        });
      }
    }
  };
}

export default badCharacterTabulation;
