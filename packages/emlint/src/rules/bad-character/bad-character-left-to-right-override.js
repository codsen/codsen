// rule: bad-character-left-to-right-override
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT OVERRIDE":
// https://www.fileformat.info/info/unicode/char/202d/index.htm

function badCharacterLeftToRightOverride(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8237) {
        context.report({
          ruleId: "bad-character-left-to-right-override",
          message: "Bad character - LEFT-TO-RIGHT OVERRIDE.",
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

export default badCharacterLeftToRightOverride;
