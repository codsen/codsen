import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-device-control-string
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL STRING":
// https://www.fileformat.info/info/unicode/char/0090/index.htm

function badCharacterDeviceControlString(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 144) {
        context.report({
          ruleId: "bad-character-device-control-string",
          message: "Bad character - DEVICE CONTROL STRING.",
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

export default badCharacterDeviceControlString;
