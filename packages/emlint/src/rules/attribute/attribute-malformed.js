import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";
import { left } from "string-left-right";

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
        `020 attributeMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `027 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if Levenshtein distance is 1 and it's not among known attribute names,
      // it's definitely mis-typed
      if (
        !node.attribNameRecognised &&
        !node.attribName.startsWith("xmlns:") &&
        !blacklist.includes(node.parent.tagName)
      ) {
        console.log(
          `038 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );

        let somethingMatched = false;
        for (let i = 0, len = allHtmlAttribs.length; i < len; i++) {
          if (leven(allHtmlAttribs[i], node.attribName) === 1) {
            console.log(`044 RAISE ERROR`);
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
            `068 RAISE ERROR, [${node.attribNameStartsAt}, ${node.attribNameEndsAt}]`
          );
          context.report({
            ruleId: "attribute-malformed",
            message: `Unrecognised attribute "${node.attribName}".`,
            idxFrom: node.attribNameStartsAt,
            idxTo: node.attribNameEndsAt,
            fix: null
          });
        }
      }

      // equal missing
      if (
        node.attribValueStartsAt !== null &&
        context.str[node.attribNameEndsAt] !== "="
      ) {
        console.log(`085 RAISE ERROR ABOUT EQUALS SIGN`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Equal is missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd, // second elem. from last range
          fix: { ranges: [[node.attribNameEndsAt, node.attribNameEndsAt, "="]] }
        });
      }

      // opening quotes missing
      const ranges = [];
      if (
        node.attribOpeningQuoteAt === null &&
        node.attribValueStartsAt !== null
      ) {
        console.log(`101 OPENING QUOTE MISSING`);
        ranges.push([
          node.attribValueStartsAt,
          node.attribValueStartsAt,
          node.attribClosingQuoteAt === null
            ? `"`
            : context.str[node.attribClosingQuoteAt]
        ]);
      }
      if (
        node.attribClosingQuoteAt === null &&
        node.attribValueEndsAt !== null
      ) {
        console.log(`114 CLOSING QUOTE MISSING`);
        ranges.push([
          node.attribValueEndsAt,
          node.attribValueEndsAt,
          node.attribOpeningQuoteAt === null
            ? `"`
            : context.str[node.attribOpeningQuoteAt]
        ]);
      }
      if (ranges.length) {
        console.log(`124 RAISE ERROR ABOUT QUOTES`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Quote${ranges.length > 1 ? "s are" : " is"} missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd, // second elem. from last range
          fix: { ranges }
        });
      }

      // repeated opening
      if (
        node.attribOpeningQuoteAt !== null &&
        node.attribNameEndsAt !== null
      ) {
        const whatShouldHaveBeenSinceEqualCharacter = context.str.slice(
          node.attribNameEndsAt,
          node.attribOpeningQuoteAt
        );
        if (
          `"'`.includes(whatShouldHaveBeenSinceEqualCharacter.slice(-1)) &&
          whatShouldHaveBeenSinceEqualCharacter.includes("=")
        ) {
          console.log(`147 RAISE ERROR ABOUT REPEATED OPENING QUOTES`);
          context.report({
            ruleId: "attribute-malformed",
            message: `Delete repeated opening quotes.`,
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            fix: {
              ranges: [
                [
                  left(context.str, node.attribOpeningQuoteAt),
                  node.attribOpeningQuoteAt
                ]
              ]
            }
          });
        }
      }
    }
  };
}

export default attributeMalformed;
