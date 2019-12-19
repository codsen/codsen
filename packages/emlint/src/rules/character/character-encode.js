// rule: character-encode
// -----------------------------------------------------------------------------

import he from "he";
import { notEmailFriendly } from "html-entities-not-email-friendly";
import { isEnabled } from "../../util/util";

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
        `032 characterEncode(): ${`\u001b[${35}m${`calculated mode`}\u001b[${39}m`} = "${mode}"`
      );
      console.log(
        `notEmailFriendly[${Object.keys(notEmailFriendly)[10]}] = ${
          notEmailFriendly[Object.keys(notEmailFriendly)[10]]
        }`
      );

      if (
        type === "text" &&
        typeof chr === "string" &&
        (chr.charCodeAt(0) > 127 || `<>"&`.includes(chr)) &&
        (chr.charCodeAt(0) !== 160 ||
          !Object.keys(context.processedRulesConfig).includes(
            "bad-character-non-breaking-space"
          ) ||
          !isEnabled(
            context.processedRulesConfig["bad-character-non-breaking-space"]
          ))
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
          `066 ${`\u001b[${33}m${`encodedChr`}\u001b[${39}m`} = ${JSON.stringify(
            encodedChr,
            null,
            4
          )}`
        );

        let charName = "";
        if (chr.charCodeAt(0) === 160) {
          charName = " no-break space";
        } else if (chr.charCodeAt(0) === 38) {
          charName = " ampersand";
        } else if (chr.charCodeAt(0) === 60) {
          charName = " less than";
        } else if (chr.charCodeAt(0) === 62) {
          charName = " greater than";
        } else if (chr.charCodeAt(0) === 34) {
          charName = " double quotes";
        } else if (chr.charCodeAt(0) === 163) {
          charName = " pound sign";
        }

        context.report({
          ruleId: "character-encode",
          message: `Unencoded${charName} character.`,
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
