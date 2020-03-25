// rule: bad-character-left-to-right-mark
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT MARK":
// https://www.fileformat.info/info/unicode/char/200e/index.htm

function badCharacterLeftToRightMark(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8206) {
        context.report({
          ruleId: "bad-character-left-to-right-mark",
          message: "Bad character - LEFT-TO-RIGHT MARK.",
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

export default badCharacterLeftToRightMark;
