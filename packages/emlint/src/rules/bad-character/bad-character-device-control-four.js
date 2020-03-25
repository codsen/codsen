// rule: bad-character-device-control-four
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL FOUR":
// https://www.fileformat.info/info/unicode/char/0014/index.htm

function badCharacterDeviceControlFour(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 20) {
        context.report({
          ruleId: "bad-character-device-control-four",
          message: "Bad character - DEVICE CONTROL FOUR.",
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

export default badCharacterDeviceControlFour;
