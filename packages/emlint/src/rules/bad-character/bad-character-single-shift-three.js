// rule: bad-character-single-shift-three
// -----------------------------------------------------------------------------

// Catches raw character "SINGLE SHIFT THREE":
// https://www.fileformat.info/info/unicode/char/008f/index.htm

function badCharacterSingleShiftTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 143) {
        context.report({
          ruleId: "bad-character-single-shift-three",
          message: "Bad character - SINGLE SHIFT THREE.",
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
