// rule: bad-character-start-of-heading
// -----------------------------------------------------------------------------

// Catches raw character "START OF HEADING":
// https://www.fileformat.info/info/unicode/char/0001/index.htm

function badCharacterStartOfHeading(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 1) {
        context.report({
          ruleId: "bad-character-start-of-heading",
          message: "Bad character - START OF HEADING.",
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

export default badCharacterStartOfHeading;
