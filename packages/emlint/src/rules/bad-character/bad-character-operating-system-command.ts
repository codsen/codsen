import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-operating-system-command
// -----------------------------------------------------------------------------

// Catches raw character "OPERATING SYSTEM COMMAND":
// https://www.fileformat.info/info/unicode/char/009d/index.htm

function badCharacterOperatingSystemCommand(context: Linter): RuleObjType {
  let charCode = 157;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - OPERATING SYSTEM COMMAND.",
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

export default badCharacterOperatingSystemCommand;
