// rule: bad-character-bell
// -----------------------------------------------------------------------------

// Catches raw character "BELL":
// https://www.fileformat.info/info/unicode/char/0007/index.htm

function badCharacterBell(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 7) {
        context.report({
          ruleId: "bad-character-bell",
          message: "Bad character - BELL.",
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

export default badCharacterBell;
