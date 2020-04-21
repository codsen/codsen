// rule: bad-character-invisible-separator
// -----------------------------------------------------------------------------

// Catches raw character "INVISIBLE SEPARATOR":
// https://www.fileformat.info/info/unicode/char/2063/index.htm

function badCharacterInvisibleSeparator(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8291) {
        context.report({
          ruleId: "bad-character-invisible-separator",
          message: "Bad character - INVISIBLE SEPARATOR.",
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

export default badCharacterInvisibleSeparator;
