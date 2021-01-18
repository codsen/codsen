import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-operating-system-command
// -----------------------------------------------------------------------------

// Catches raw character "OPERATING SYSTEM COMMAND":
// https://www.fileformat.info/info/unicode/char/009d/index.htm

function badCharacterOperatingSystemCommand(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 157) {
        context.report({
          ruleId: "bad-character-operating-system-command",
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
