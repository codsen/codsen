// rule: bad-character-single-shift-two
// -----------------------------------------------------------------------------

// Catches raw character "SINGLE SHIFT TWO":
// https://www.fileformat.info/info/unicode/char/008e/index.htm

function badCharacterSingleShiftTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 142) {
        context.report({
          ruleId: "bad-character-single-shift-two",
          message: "Bad character - SINGLE SHIFT TWO.",
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

export default badCharacterSingleShiftTwo;
