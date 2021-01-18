import { Linter, RuleObjType } from "../../linter";
import { isMediaD } from "is-media-descriptor";

// rule: media-malformed
// -----------------------------------------------------------------------------

// it tap the is-media-descriptor that we already use on tags
// to validate media query selectors, for example (rogue letter "e"):
// @media screeen {
//   ...
// }

function mediaMalformed(context: Linter): RuleObjType {
  return {
    at(node) {
      console.log(
        `███████████████████████████████████████ mediaMalformed() ███████████████████████████████████████`
      );
      console.log(
        `026 mediaMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.identifier === "media") {
        const errors = isMediaD(node.query, {
          offset: node.queryStartsAt,
        });
        console.log(
          `034 mediaMalformed(): ${`\u001b[${33}m${`errors`}\u001b[${39}m`} = ${JSON.stringify(
            errors,
            null,
            4
          )}`
        );

        errors.forEach((errorObj) => {
          console.log(`042 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "media-malformed" });
        });
      }

      // if (node.tagName === "bold") {
      //   console.log(`037 RAISE ERROR [${node.start}, ${node.end}]`);
      //   context.report({
      //     ruleId: "media-malformed",
      //     message: `Tag "bold" does not exist in HTML.`,
      //     idxFrom: node.start,
      //     idxTo: node.end, // second elem. from last range
      //     fix: {
      //       ranges: [[node.tagNameStartsAt, node.tagNameEndsAt, suggested]]
      //     }
      //   });
      // }
    },
  };
}

export default mediaMalformed;
