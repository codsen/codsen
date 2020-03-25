// rule: bad-character-reverse-line-feed
// -----------------------------------------------------------------------------

// Catches raw character "REVERSE LINE FEED":
// https://www.fileformat.info/info/unicode/char/008d/index.htm

function badCharacterReverseLineFeed(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 141) {
        context.report({
          ruleId: "bad-character-reverse-line-feed",
          message: "Bad character - REVERSE LINE FEED.",
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

export default badCharacterReverseLineFeed;
