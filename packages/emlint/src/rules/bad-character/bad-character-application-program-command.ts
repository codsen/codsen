import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-application-program-command
// -----------------------------------------------------------------------------

// Catches raw character "APPLICATION PROGRAM COMMAND":
// https://www.fileformat.info/info/unicode/char/009f/index.htm

function badCharacterApplicationProgramCommand(context: Linter): RuleObjType {
  const charCode = 159;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
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
