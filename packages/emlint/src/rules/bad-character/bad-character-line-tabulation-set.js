// rule: bad-character-line-tabulation-set
// -----------------------------------------------------------------------------

// Catches raw character "LINE TABULATION SET":
// https://www.fileformat.info/info/unicode/char/008a/index.htm

function badCharacterLineTabulationSet(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 138) {
        context.report({
          ruleId: "bad-character-line-tabulation-set",
          message: "Bad character - LINE TABULATION SET.",
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

export default badCharacterLineTabulationSet;
