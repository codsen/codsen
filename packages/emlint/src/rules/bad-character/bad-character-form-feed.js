// rule: bad-character-form-feed
// -----------------------------------------------------------------------------

// Catches raw character "FORM FEED":
// https://www.fileformat.info/info/unicode/char/000c/index.htm

function badCharacterFormFeed(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 12) {
        context.report({
          ruleId: "bad-character-form-feed",
          message: "Bad character - FORM FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]] // just delete it
          }
        });
      }
    }
  };
}

export default badCharacterFormFeed;
