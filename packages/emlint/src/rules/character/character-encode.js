// rule: character-encode
// -----------------------------------------------------------------------------

import he from "he";
import { notEmailFriendly } from "html-entities-not-email-friendly";

// Catches characters outside ASCII and suggests encoding.
// Applies only to "text" scope

function characterEncode(context, ...opts) {
  return {
    character: function({ type, chr, i }) {
      console.log(
        `███████████████████████████████████████ characterEncode() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // settle the mode, is it "always" or a default, "never"
      let mode = "named";
      // opts array comes already sliced, without 1st element, so opts value
      // is 0th (and onwards if more)
      if (Array.isArray(opts) && ["named", "numeric"].includes(opts[0])) {
        mode = opts[0];
      }
      console.log(
        `031 characterEncode(): ${`\u001b[${35}m${`calculated mode`}\u001b[${39}m`} = "${mode}"`
      );
      console.log(
        `notEmailFriendly[${Object.keys(notEmailFriendly)[10]}] = ${
          notEmailFriendly[Object.keys(notEmailFriendly)[10]]
        }`
      );

      if (
        type === "text" &&
        typeof chr === "string" &&
        (chr.charCodeAt(0) > 127 || `<>"&`.includes(chr))
      ) {
        let encodedChr = he.encode(chr, {
          useNamedReferences: mode === "named"
        });
        if (
          Object.keys(notEmailFriendly).includes(
            encodedChr.slice(1, encodedChr.length - 1)
          )
        ) {
          encodedChr = `&${
            notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)]
          };`;
        }

        console.log(
          `058 ${`\u001b[${33}m${`encodedChr`}\u001b[${39}m`} = ${JSON.stringify(
            encodedChr,
            null,
            4
          )}`
        );

        context.report({
          ruleId: "character-encode",
          message: "Unencoded character.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, encodedChr]]
          }
        });
      }
    }
  };
}

export default characterEncode;
