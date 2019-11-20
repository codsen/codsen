// rule: bad-character-character-tabulation-set
// -----------------------------------------------------------------------------

// Catches raw character "CHARACTER TABULATION SET":
// https://www.fileformat.info/info/unicode/char/0088/index.htm

function badCharacterCharacterTabulationSet(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 136) {
        context.report({
          ruleId: "bad-character-character-tabulation-set",
          message: "Bad character - CHARACTER TABULATION SET.",
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

export default badCharacterCharacterTabulationSet;
