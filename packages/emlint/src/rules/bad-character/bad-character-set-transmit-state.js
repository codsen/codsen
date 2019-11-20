// rule: bad-character-set-transmit-state
// -----------------------------------------------------------------------------

// Catches raw character "SET TRANSMIT STATE":
// https://www.fileformat.info/info/unicode/char/0093/index.htm

function badCharacterSetTransmitState(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 147) {
        context.report({
          ruleId: "bad-character-set-transmit-state",
          message: "Bad character - SET TRANSMIT STATE.",
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

export default badCharacterSetTransmitState;
