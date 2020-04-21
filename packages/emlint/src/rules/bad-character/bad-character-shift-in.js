// rule: bad-character-shift-in
// -----------------------------------------------------------------------------

// Catches raw character "SHIFT IN":
// https://www.fileformat.info/info/unicode/char/000f/index.htm

function badCharacterShiftIn(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 15) {
        context.report({
          ruleId: "bad-character-shift-in",
          message: "Bad character - SHIFT IN.",
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

export default badCharacterShiftIn;
