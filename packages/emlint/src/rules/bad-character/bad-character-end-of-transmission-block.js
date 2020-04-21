// rule: bad-character-end-of-transmission-block
// -----------------------------------------------------------------------------

// Catches raw character "END OF TRANSMISSION BLOCK":
// https://www.fileformat.info/info/unicode/char/0017/index.htm

function badCharacterEndOfTransmissionBlock(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 23) {
        context.report({
          ruleId: "bad-character-end-of-transmission-block",
          message: "Bad character - END OF TRANSMISSION BLOCK.",
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

export default badCharacterEndOfTransmissionBlock;
