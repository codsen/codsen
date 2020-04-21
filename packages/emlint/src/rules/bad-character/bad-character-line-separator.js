// rule: bad-character-line-separator
// -----------------------------------------------------------------------------

// Catches raw character "LINE SEPARATOR":
// https://www.fileformat.info/info/unicode/char/2028/index.htm

function badCharacterLineSeparator(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8232) {
        context.report({
          ruleId: "bad-character-line-separator",
          message: "Bad character - LINE SEPARATOR.",
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

export default badCharacterLineSeparator;
