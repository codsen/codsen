// rule: bad-character-delete
// -----------------------------------------------------------------------------

// Catches raw character "DELETE":
// https://www.fileformat.info/info/unicode/char/007f/index.htm

function badCharacterDelete(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 127) {
        context.report({
          ruleId: "bad-character-delete",
          message: "Bad character - DELETE.",
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

export default badCharacterDelete;
