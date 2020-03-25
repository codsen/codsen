// rule: bad-character-pop-directional-formatting
// -----------------------------------------------------------------------------

// Catches raw character "POP DIRECTIONAL FORMATTING":
// https://www.fileformat.info/info/unicode/char/202c/index.htm

function badCharacterPopDirectionalFormatting(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8236) {
        context.report({
          ruleId: "bad-character-pop-directional-formatting",
          message: "Bad character - POP DIRECTIONAL FORMATTING.",
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

export default badCharacterPopDirectionalFormatting;
