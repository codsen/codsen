import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-set-transmit-state
// -----------------------------------------------------------------------------

// Catches raw character "SET TRANSMIT STATE":
// https://www.fileformat.info/info/unicode/char/0093/index.htm

function badCharacterSetTransmitState(context: Linter): RuleObjType {
  let charCode = 147;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - SET TRANSMIT STATE.",
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

export default badCharacterSetTransmitState;
