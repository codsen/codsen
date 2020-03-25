// rule: bad-character-escape
// -----------------------------------------------------------------------------

// Catches raw character "ESCAPE":
// https://www.fileformat.info/info/unicode/char/001b/index.htm

function badCharacterEscape(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 27) {
        context.report({
          ruleId: "bad-character-escape",
          message: "Bad character - ESCAPE.",
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

export default badCharacterEscape;
