import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-device-control-four
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL FOUR":
// https://www.fileformat.info/info/unicode/char/0014/index.htm

function badCharacterDeviceControlFour(context: Linter): RuleObjType {
  const charCode = 20;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
