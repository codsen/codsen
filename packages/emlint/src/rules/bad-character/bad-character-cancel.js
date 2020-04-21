// rule: bad-character-cancel
// -----------------------------------------------------------------------------

// Catches raw character "CANCEL":
// https://www.fileformat.info/info/unicode/char/0018/index.htm

function badCharacterCancel(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 24) {
        context.report({
          ruleId: "bad-character-cancel",
          message: "Bad character - CANCEL.",
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

export default badCharacterCancel;
