// rule: bad-character-control-0099
// -----------------------------------------------------------------------------

// Catches raw character "CONTROL" (hex 99):
// https://www.fileformat.info/info/unicode/char/0099/index.htm

function badCharacterControl0099(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 153) {
        context.report({
          ruleId: "bad-character-control-0099",
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

export default badCharacterControl0099;
