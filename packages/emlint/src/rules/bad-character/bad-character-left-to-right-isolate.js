// rule: bad-character-left-to-right-isolate
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT ISOLATE":
// https://www.fileformat.info/info/unicode/char/2066/index.htm

function badCharacterLeftToRightIsolate(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8294) {
        context.report({
          ruleId: "bad-character-left-to-right-isolate",
          message: "Bad character - LEFT-TO-RIGHT ISOLATE.",
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

export default badCharacterLeftToRightIsolate;
