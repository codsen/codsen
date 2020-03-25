// rule: bad-character-line-tabulation
// -----------------------------------------------------------------------------

// Catches raw character "LINE TABULATION":
// https://www.fileformat.info/info/unicode/char/000b/index.htm

function badCharacterLineTabulation(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 11) {
        context.report({
          ruleId: "bad-character-line-tabulation",
          message: "Bad character - LINE TABULATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]], // just delete it
          },
        });
      }
    },
  };
}

export default badCharacterLineTabulation;
