// rule: bad-character-soft-hyphen
// -----------------------------------------------------------------------------

// Catches raw character "SOFT HYPHEN":
// https://www.fileformat.info/info/unicode/char/00ad/index.htm

function badCharacterSoftHyphen(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 173) {
        context.report({
          ruleId: "bad-character-soft-hyphen",
          message: "Bad character - SOFT HYPHEN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterSoftHyphen;
