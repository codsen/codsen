// rule: bad-character-function-application
// -----------------------------------------------------------------------------

// Catches raw character "FUNCTION APPLICATION":
// https://www.fileformat.info/info/unicode/char/2061/index.htm

function badCharacterFunctionApplication(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8289) {
        context.report({
          ruleId: "bad-character-function-application",
          message: "Bad character - FUNCTION APPLICATION.",
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

export default badCharacterFunctionApplication;
