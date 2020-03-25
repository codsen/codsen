// rule: bad-character-device-control-one
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL ONE":
// https://www.fileformat.info/info/unicode/char/0011/index.htm

function badCharacterDeviceControlOne(context) {
  return {
    character: function ({ chr, i }) {
      if (chr.charCodeAt(0) === 17) {
        context.report({
          ruleId: "bad-character-device-control-one",
          message: "Bad character - DEVICE CONTROL ONE.",
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

export default badCharacterDeviceControlOne;
