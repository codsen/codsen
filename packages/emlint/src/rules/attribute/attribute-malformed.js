import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";

// rule: attribute-malformed
// -----------------------------------------------------------------------------

// it flags up malformed HTML attributes

function attributeMalformed(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeMalformed() ███████████████████████████████████████`
      );
      console.log(
        `016 attributeMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `023 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if Levenshtein distance is 1 and it's not among known attribute names,
      // it's definitely mis-typed
      if (!node.attribNameRecognised) {
        console.log(
          `030 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );
        for (let i = 0, len = allHtmlAttribs.length; i < len; i++) {
          if (leven(allHtmlAttribs[i], node.attribName) === 1) {
            console.log(`034 RAISE ERROR`);
            context.report({
              ruleId: "attribute-malformed",
              message: `Probably meant "${allHtmlAttribs[i]}".`,
              idxFrom: node.attribNameStartAt,
              idxTo: node.attribNameEndAt, // second elem. from last range
              fix: {
                ranges: [
                  [
                    node.attribNameStartAt,
                    node.attribNameEndAt,
                    allHtmlAttribs[i]
                  ]
                ]
              }
            });
            break;
          }
        }
      }

      if (
        node.attribValueStartAt !== null &&
        context.str[node.attribNameEndAt] !== "="
      ) {
        console.log(`059 RAISE ERROR`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Equal is missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd, // second elem. from last range
          fix: { ranges: [[node.attribNameEndAt, node.attribNameEndAt, "="]] }
        });
      }
    }
  };
}

export default attributeMalformed;
