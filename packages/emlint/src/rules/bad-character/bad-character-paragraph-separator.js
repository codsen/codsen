// rule: bad-character-paragraph-separator
// -----------------------------------------------------------------------------

// Catches raw character "PARAGRAPH SEPARATOR":
// https://www.fileformat.info/info/unicode/char/2029/index.htm

function badCharacterParagraphSeparator(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8233) {
        context.report({
          ruleId: "bad-character-paragraph-separator",
          message: "Bad character - PARAGRAPH SEPARATOR.",
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

export default badCharacterParagraphSeparator;
