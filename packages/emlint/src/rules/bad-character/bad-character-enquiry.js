// rule: bad-character-enquiry
// -----------------------------------------------------------------------------

// Catches raw character "ENQUIRY":
// https://www.fileformat.info/info/unicode/char/0005/index.htm

function badCharacterEnquiry(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 5) {
        context.report({
          ruleId: "bad-character-enquiry",
          message: "Bad character - ENQUIRY.",
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

export default badCharacterEnquiry;
