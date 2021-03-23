import { Linter, RuleObjType } from "../../linter";
import { isAnEnabledValue } from "../../util/util";
import validateCharEncoding from "../../util/validateCharEncoding";

// rule: character-encode
// -----------------------------------------------------------------------------

type Config = "named" | "numeric";

function characterEncode(context: Linter, ...config: Config[]): RuleObjType {
  return {
    text(token) {
      console.log(
        `███████████████████████████████████████ characterEncode() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${36}m${`token: ${JSON.stringify(
          token,
          null,
          4
        )}`}\u001b[${39}m`}`
      );

      if (!token.value) {
        console.log(
          `026 ${`\u001b[${31}m${`early return, no value`}\u001b[${39}m`}`
        );
        return;
      }

      let mode: Config = "named";
      if (config.includes("numeric")) {
        mode = "numeric";
      }
      console.log(
        `036 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );

      // ACTION

      // traverse the value of this text node:
      for (let i = 0, len = token.value.length; i < len; i++) {
        if (
          (token.value[i].charCodeAt(0) > 127 ||
            `<>"`.includes(token.value[i])) &&
          (token.value[i].charCodeAt(0) !== 160 ||
            !Object.keys(context.processedRulesConfig).includes(
              "bad-character-non-breaking-space"
            ) ||
            !isAnEnabledValue(
              context.processedRulesConfig["bad-character-non-breaking-space"]
            ))
        ) {
          console.log(
            `059 ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} ${`\u001b[${33}m${`validateCharEncoding()`}\u001b[${39}m`}`
          );
          validateCharEncoding(token.value[i], i + token.start, mode, context);
        }
      }
    },
  };
}

export default characterEncode;
