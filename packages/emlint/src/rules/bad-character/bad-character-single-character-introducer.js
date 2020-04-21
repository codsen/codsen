// rule: bad-character-single-character-introducer
// -----------------------------------------------------------------------------

// Catches raw character "SINGLE CHARACTER INTRODUCER":
// https://www.fileformat.info/info/unicode/char/009a/index.htm

function badCharacterSingleCharacterIntroducer(context) {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 154) {
        context.report({
          ruleId: "bad-character-single-character-introducer",
          message: "Bad character - SINGLE CHARACTER INTRODUCER.",
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

export default badCharacterSingleCharacterIntroducer;
