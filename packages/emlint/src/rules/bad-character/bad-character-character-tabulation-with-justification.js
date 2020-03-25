// rule: bad-character-character-tabulation-with-justification
// -----------------------------------------------------------------------------

// Catches raw character "CHARACTER TABULATION WITH JUSTIFICATION":
// https://www.fileformat.info/info/unicode/char/0089/index.htm

function badCharacterCharacterTabulationWithJustification(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 137) {
        context.report({
          ruleId: "bad-character-character-tabulation-with-justification",
          message: "Bad character - CHARACTER TABULATION WITH JUSTIFICATION.",
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

export default badCharacterCharacterTabulationWithJustification;
