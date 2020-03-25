// rule: bad-character-inhibit-arabic-form-shaping
// -----------------------------------------------------------------------------

// Catches raw character "INHIBIT ARABIC FORM SHAPING":
// https://www.fileformat.info/info/unicode/char/206c/index.htm

function badCharacterInhibitArabicFormShaping(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 8300) {
        context.report({
          ruleId: "bad-character-inhibit-arabic-form-shaping",
          message: "Bad character - INHIBIT ARABIC FORM SHAPING.",
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

export default badCharacterInhibitArabicFormShaping;
