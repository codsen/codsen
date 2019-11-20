// rule: bad-character-device-control-two
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL TWO":
// https://www.fileformat.info/info/unicode/char/0012/index.htm

function badCharacterDeviceControlTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 18) {
        context.report({
          ruleId: "bad-character-device-control-two",
          message: "Bad character - DEVICE CONTROL TWO.",
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

export default badCharacterDeviceControlTwo;
