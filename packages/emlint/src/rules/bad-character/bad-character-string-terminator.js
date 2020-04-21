// rule: bad-character-string-terminator
// -----------------------------------------------------------------------------

// Catches raw character "STRING TERMINATOR":
// https://www.fileformat.info/info/unicode/char/009c/index.htm

function badCharacterStringTerminator(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 156) {
        context.report({
          ruleId: "bad-character-string-terminator",
          message: "Bad character - STRING TERMINATOR.",
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

export default badCharacterStringTerminator;
