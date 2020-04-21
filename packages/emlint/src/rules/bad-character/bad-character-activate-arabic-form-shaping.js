// rule: bad-character-activate-arabic-form-shaping
// -----------------------------------------------------------------------------

// Catches raw character "ACTIVATE ARABIC FORM SHAPING":
// https://www.fileformat.info/info/unicode/char/206d/index.htm

function badCharacterActivateArabicFormShaping(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8301) {
        context.report({
          ruleId: "bad-character-activate-arabic-form-shaping",
          message: "Bad character - ACTIVATE ARABIC FORM SHAPING.",
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

export default badCharacterActivateArabicFormShaping;
