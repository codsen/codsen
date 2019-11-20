// rule: bad-character-word-joiner
// -----------------------------------------------------------------------------

// Catches raw character "WORD JOINER":
// https://www.fileformat.info/info/unicode/char/2060/index.htm

function badCharacterWordJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8288) {
        context.report({
          ruleId: "bad-character-word-joiner",
          message: "Bad character - WORD JOINER.",
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

export default badCharacterWordJoiner;
