// rule: bad-character-three-per-em-space
// -----------------------------------------------------------------------------

// Catches raw character "THREE-PER-EM SPACE":
// https://www.fileformat.info/info/unicode/char/2004/index.htm

function badCharacterThreePerEmSpace(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8196) {
        context.report({
          ruleId: "bad-character-three-per-em-space",
          message: "Bad character - THREE-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterThreePerEmSpace;
