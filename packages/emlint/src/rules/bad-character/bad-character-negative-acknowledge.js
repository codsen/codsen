// rule: bad-character-negative-acknowledge
// -----------------------------------------------------------------------------

// Catches raw character "NEGATIVE ACKNOWLEDGE":
// https://www.fileformat.info/info/unicode/char/0015/index.htm

function badCharacterNegativeAcknowledge(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 21) {
        context.report({
          ruleId: "bad-character-negative-acknowledge",
          message: "Bad character - NEGATIVE ACKNOWLEDGE.",
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

export default badCharacterNegativeAcknowledge;
