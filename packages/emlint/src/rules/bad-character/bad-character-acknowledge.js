// rule: bad-character-acknowledge
// -----------------------------------------------------------------------------

// Catches raw character "ACKNOWLEDGE":
// https://www.fileformat.info/info/unicode/char/0006/index.htm

function badCharacterAcknowledge(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 6) {
        context.report({
          ruleId: "bad-character-acknowledge",
          message: "Bad character - ACKNOWLEDGE.",
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

export default badCharacterAcknowledge;
