// rule: bad-character-end-of-selected-area
// -----------------------------------------------------------------------------

// Catches raw character "END OF SELECTED AREA":
// https://www.fileformat.info/info/unicode/char/0087/index.htm

function badCharacterEndOfSelectedArea(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 135) {
        context.report({
          ruleId: "bad-character-end-of-selected-area",
          message: "Bad character - END OF SELECTED AREA.",
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

export default badCharacterEndOfSelectedArea;
