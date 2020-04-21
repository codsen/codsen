// rule: bad-character-interlinear-annotation-terminator
// -----------------------------------------------------------------------------

// Catches raw character "INTERLINEAR ANNOTATION TERMINATOR":
// https://www.fileformat.info/info/unicode/char/fffb/index.htm

function badCharacterInterlinearAnnotationTerminator(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 65531) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-terminator",
          message: "Bad character - INTERLINEAR ANNOTATION TERMINATOR.",
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

export default badCharacterInterlinearAnnotationTerminator;
