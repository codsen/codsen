import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-application-program-command
// -----------------------------------------------------------------------------

// Catches raw character "APPLICATION PROGRAM COMMAND":
// https://www.fileformat.info/info/unicode/char/009f/index.htm

function badCharacterApplicationProgramCommand(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 159) {
        context.report({
          ruleId: "bad-character-application-program-command",
          message: "Bad character - APPLICATION PROGRAM COMMAND.",
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

export default badCharacterApplicationProgramCommand;
