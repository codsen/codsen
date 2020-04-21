// rule: bad-character-right-to-left-isolate
// -----------------------------------------------------------------------------

// Catches raw character "RIGHT-TO-LEFT ISOLATE":
// https://www.fileformat.info/info/unicode/char/2067/index.htm

function badCharacterRightToLeftIsolate(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8295) {
        context.report({
          ruleId: "bad-character-right-to-left-isolate",
          message: "Bad character - RIGHT-TO-LEFT ISOLATE.",
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

export default badCharacterRightToLeftIsolate;
