import { Linter, RuleObjType } from "../../linter";
import { isAnEnabledValue } from "../../util/util";
import validateCharEncoding from "../../util/validateCharEncoding";
import { badChars } from "../../util/bad-character-all";

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
          `027 ${`\u001b[${31}m${`early return, no value`}\u001b[${39}m`}`
        );
        return;
      }

      let mode: Config = "named";
      if (config.includes("numeric")) {
        mode = "numeric";
      }
      console.log(
        `037 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );

      // ACTION

      // traverse the value of this text node:
      for (let i = 0, len = token.value.length; i < len; i++) {
        const charCode = token.value[i].charCodeAt(0);
        // We have to avoid encoding characters which bad-character-* rule
        // would delete. Encoding would be bad, because deletion Range (like [0, 1])
        // would get merge with replacement range (like [0, 1, "&#xFFFD;"]) and
        // the character would just get encoded rather deleted.

        if (
          // it's outside ASCII
          (charCode > 127 &&
            // and if so, either does not have a bad-character-* rule for it
            (!badChars.has(charCode) ||
              // or it does but it's not enabled
              !isAnEnabledValue(
                context.processedRulesConfig[badChars.get(charCode) as string]
              ))) ||
          // or it's within ASCII, but it's a special character for HTML markup
          `<>"`.includes(token.value[i])
        ) {
          console.log(
            `067 ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} ${`\u001b[${33}m${`validateCharEncoding()`}\u001b[${39}m`}`
          );
          validateCharEncoding(token.value[i], i + token.start, mode, context);
        }
      }
    },
  };
}

export default characterEncode;
