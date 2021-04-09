import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-device-control-one
// -----------------------------------------------------------------------------

// Catches raw character "DEVICE CONTROL ONE":
// https://www.fileformat.info/info/unicode/char/0011/index.htm

function badCharacterDeviceControlOne(context: Linter): RuleObjType {
  const charCode = 17;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
