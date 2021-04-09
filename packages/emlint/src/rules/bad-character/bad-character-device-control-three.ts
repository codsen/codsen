import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-device-control-three
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL THREE":
// https://www.fileformat.info/info/unicode/char/0013/index.htm

function badCharacterDeviceControlThree(context: Linter): RuleObjType {
  const charCode = 19;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - DEVICE CONTROL THREE.",
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

export default badCharacterDeviceControlThree;
