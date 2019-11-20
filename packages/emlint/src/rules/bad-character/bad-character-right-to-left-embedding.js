// rule: bad-character-right-to-left-embedding
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT EMBEDDING":
// https://www.fileformat.info/info/unicode/char/202b/index.htm

function badCharacterRightToLeftEmbedding(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8235) {
        context.report({
          ruleId: "bad-character-right-to-left-embedding",
          message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
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

export default badCharacterRightToLeftEmbedding;
