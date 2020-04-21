// rule: bad-character-break-permitted-here
// -----------------------------------------------------------------------------

// Catches raw character "BREAK PERMITTED HERE":
// https://www.fileformat.info/info/unicode/char/0082/index.htm

function badCharacterBreakPermittedHere(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 130) {
        context.report({
          ruleId: "bad-character-break-permitted-here",
          message: "Bad character - BREAK PERMITTED HERE.",
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

export default badCharacterBreakPermittedHere;
