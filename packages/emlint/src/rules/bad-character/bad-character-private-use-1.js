// rule: bad-character-private-use-1
// -----------------------------------------------------------------------------

// Catches raw character "PRIVATE USE ONE":
// https://www.fileformat.info/info/unicode/char/0091/index.htm

function badCharacterPrivateUseOne(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 145) {
        context.report({
          ruleId: "bad-character-private-use-1",
          message: "Bad character - PRIVATE USE ONE.",
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

export default badCharacterPrivateUseOne;
