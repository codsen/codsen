// rule: bad-character-pop-directional-isolate
// -----------------------------------------------------------------------------

// Catches raw character "FIRST STRONG ISOLATE":
// https://www.fileformat.info/info/unicode/char/2069/index.htm

function badCharacterPopDirectionalIsolate(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8297) {
        context.report({
          ruleId: "bad-character-pop-directional-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
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

export default badCharacterPopDirectionalIsolate;
