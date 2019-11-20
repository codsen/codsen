// rule: bad-character-device-control-three
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL THREE":
// https://www.fileformat.info/info/unicode/char/0013/index.htm

function badCharacterDeviceControlThree(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 19) {
        context.report({
          ruleId: "bad-character-device-control-three",
          message: "Bad character - DEVICE CONTROL THREE.",
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

export default badCharacterDeviceControlThree;
