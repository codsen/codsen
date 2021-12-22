import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-device-control-two
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL TWO":
// https://www.fileformat.info/info/unicode/char/0012/index.htm

function badCharacterDeviceControlTwo(context: Linter): RuleObjType {
  let charCode = 18;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - DEVICE CONTROL TWO.",
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

export default badCharacterDeviceControlTwo;
