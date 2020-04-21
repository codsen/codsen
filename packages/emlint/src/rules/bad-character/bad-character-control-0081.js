// rule: bad-character-control-0081
// -----------------------------------------------------------------------------

// Catches raw character "CONTROL" (hex 81):
// https://www.fileformat.info/info/unicode/char/0081/index.htm

function badCharacterControl0081(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 129) {
        context.report({
          ruleId: "bad-character-control-0081",
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

export default badCharacterControl0081;
