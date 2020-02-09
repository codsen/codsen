import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";

// rule: attribute-malformed
// -----------------------------------------------------------------------------

// it flags up malformed HTML attributes

function attributeMalformed(context, ...opts) {
  // the following tags will be processed separately
  const blacklist = ["doctype"];

  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeMalformed() ███████████████████████████████████████`
      );
      console.log(
        `019 attributeMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `026 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if Levenshtein distance is 1 and it's not among known attribute names,
      // it's definitely mis-typed
      if (
        !node.attribNameRecognised &&
        !node.attribName.startsWith("xmlns:") &&
        !blacklist.includes(node.parent.tagName)
      ) {
        console.log(
          `037 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );

        let somethingMatched = false;
        for (let i = 0, len = allHtmlAttribs.length; i < len; i++) {
          if (leven(allHtmlAttribs[i], node.attribName) === 1) {
            console.log(`043 RAISE ERROR`);
            context.report({
              ruleId: "attribute-malformed",
              message: `Probably meant "${allHtmlAttribs[i]}".`,
              idxFrom: node.attribNameStartsAt,
              idxTo: node.attribNameEndsAt, // second elem. from last range
              fix: {
                ranges: [
                  [
                    node.attribNameStartsAt,
                    node.attribNameEndsAt,
                    allHtmlAttribs[i]
                  ]
                ]
              }
            });
            somethingMatched = true;
            break;
          }
        }

        if (!somethingMatched) {
          // the attribute was not recognised
          console.log(
            `067 RAISE ERROR, [${node.attribNameStartsAt}, ${node.attribNameEndsAt}]`
          );
          context.report({
            ruleId: "attribute-malformed",
            message: `Unrecognised attribute "${node.attribName}".`,
            idxFrom: node.attribNameStartsAt,
            idxTo: node.attribNameEndsAt,
            fix: null
          });
        }
      } else if (
        node.attribValueStartsAt !== null &&
        context.str[node.attribNameEndsAt] !== "="
      ) {
        console.log(`081 RAISE ERROR`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Equal is missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd, // second elem. from last range
          fix: { ranges: [[node.attribNameEndsAt, node.attribNameEndsAt, "="]] }
        });
      }
    }
  };
}

export default attributeMalformed;
