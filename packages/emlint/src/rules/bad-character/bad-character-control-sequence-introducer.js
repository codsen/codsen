// rule: bad-character-control-sequence-introducer
// -----------------------------------------------------------------------------

// Catches raw character "CONTROL SEQUENCE INTRODUCER":
// https://www.fileformat.info/info/unicode/char/009b/index.htm

function badCharacterControlSequenceIntroducer(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 155) {
        context.report({
          ruleId: "bad-character-control-sequence-introducer",
          message: "Bad character - CONTROL SEQUENCE INTRODUCER.",
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

export default badCharacterControlSequenceIntroducer;
