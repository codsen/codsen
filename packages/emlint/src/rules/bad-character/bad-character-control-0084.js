// rule: bad-character-control-0084
// -----------------------------------------------------------------------------

// Catches raw character "CONTROL" (hex 84):
// https://www.fileformat.info/info/unicode/char/0084/index.htm

function badCharacterControl0084(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 132) {
        context.report({
          ruleId: "bad-character-control-0084",
          message: "Bad character - CONTROL.",
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

export default badCharacterControl0084;
