// rule: bad-character-start-of-text
// -----------------------------------------------------------------------------

// Catches raw character "START OF TEXT":
// https://www.fileformat.info/info/unicode/char/0002/index.htm

function badCharacterStartOfText(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 2) {
        context.report({
          ruleId: "bad-character-start-of-text",
          message: "Bad character - START OF TEXT.",
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

export default badCharacterStartOfText;
