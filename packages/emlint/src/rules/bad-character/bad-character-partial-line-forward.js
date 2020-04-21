// rule: bad-character-partial-line-forward
// -----------------------------------------------------------------------------

// Catches raw character "PARTIAL LINE FORWARD":
// https://www.fileformat.info/info/unicode/char/008b/index.htm

function badCharacterPartialLineForward(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 139) {
        context.report({
          ruleId: "bad-character-partial-line-forward",
          message: "Bad character - PARTIAL LINE FORWARD.",
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

export default badCharacterPartialLineForward;
