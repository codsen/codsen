// rule: bad-character-start-of-string
// -----------------------------------------------------------------------------

// Catches raw character "START OF STRING":
// https://www.fileformat.info/info/unicode/char/0098/index.htm

function badCharacterStartOfString(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 152) {
        context.report({
          ruleId: "bad-character-start-of-string",
          message: "Bad character - START OF STRING.",
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

export default badCharacterStartOfString;
