// rule: bad-character-private-message
// -----------------------------------------------------------------------------

// Catches raw character "PRIVATE MESSAGE":
// https://www.fileformat.info/info/unicode/char/009e/index.htm

function badCharacterPrivateMessage(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 158) {
        context.report({
          ruleId: "bad-character-private-message",
          message: "Bad character - PRIVATE MESSAGE.",
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

export default badCharacterPrivateMessage;
