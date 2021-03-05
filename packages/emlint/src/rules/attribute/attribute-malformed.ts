import { Linter, RuleObjType } from "../../linter";
import { Range } from "../../../../../scripts/common";

import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";
// import { left } from "string-left-right";

// rule: attribute-malformed
// -----------------------------------------------------------------------------

// it flags up malformed HTML attributes

function attributeMalformed(context: Linter): RuleObjType {
  // the following tags will be processed separately
  const blacklist = ["doctype"];

  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeMalformed() ███████████████████████████████████████`
      );
      console.log(
        `023 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if Levenshtein distance is 1 and it's not among known attribute names,
      // it's definitely mis-typed
      if (
        !node.attribNameRecognised &&
        node.attribName &&
        !node.attribName.startsWith("xmlns:") &&
        !blacklist.includes(node.parent.tagName as string)
      ) {
        console.log(
          `035 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );

        let somethingMatched = false;

        for (const oneOfAttribs of allHtmlAttribs.values()) {
          if (leven(oneOfAttribs, node.attribName) === 1) {
            console.log(`042 RAISE ERROR`);
            context.report({
              ruleId: "attribute-malformed",
              message: `Probably meant "${oneOfAttribs}".`,
              idxFrom: node.attribNameStartsAt,
              idxTo: node.attribNameEndsAt, // second elem. from last range
              fix: {
                ranges: [
                  [
                    node.attribNameStartsAt,
                    node.attribNameEndsAt,
                    oneOfAttribs,
                  ],
                ],
              },
            });
            somethingMatched = true;
            break;
          }
        }

        if (!somethingMatched) {
          // the attribute was not recognised
          console.log(
            `066 RAISE ERROR, [${node.attribNameStartsAt}, ${node.attribNameEndsAt}]`
          );
          context.report({
            ruleId: "attribute-malformed",
            message: `Unrecognised attribute "${node.attribName}".`,
            idxFrom: node.attribNameStartsAt,
            idxTo: node.attribNameEndsAt,
            fix: null,
          });
        }
      }

      // context.str[node.attribNameEndsAt] !== "="
      // equal missing or something's wrong around it
      if (node.attribNameEndsAt && node.attribValueStartsAt) {
        console.log(`081`);
        if (
          // if opening quotes are present, let's use their location
          node.attribOpeningQuoteAt !== null &&
          context.str.slice(
            node.attribNameEndsAt,
            node.attribOpeningQuoteAt
          ) !== "="
        ) {
          console.log(`090`);
          let message = `Malformed around equal.`;
          if (
            !context.str
              .slice(node.attribNameEndsAt, node.attribOpeningQuoteAt)
              .includes("=")
          ) {
            console.log(
              `098 ${`\u001b[${31}m${`EQUAL MISSING`}\u001b[${39}m`}`
            );
            message = `Equal is missing.`;
          }

          let fromRange = node.attribNameEndsAt;
          const toRange = node.attribOpeningQuoteAt;
          let whatToAdd: undefined | string = "=";

          // if equals is in a correct place, don't replace it
          if (context.str[fromRange] === "=") {
            fromRange += 1;
            whatToAdd = undefined;
          }

          console.log(
            `114 ${`\u001b[${31}m${`RAISE ERROR ABOUT EQUALS SIGN`}\u001b[${39}m`}`
          );
          context.report({
            ruleId: "attribute-malformed",
            message,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: whatToAdd
                ? [[fromRange, toRange, "="]]
                : [[fromRange, toRange]],
            },
          });
        }
      }

      // repeated opening quotes
      if (
        // value starts with a quote
        node.attribValueRaw &&
        (node.attribValueRaw.startsWith(`"`) ||
          node.attribValueRaw.startsWith(`'`)) &&
        node.attribValueStartsAt &&
        node.attribOpeningQuoteAt &&
        context.str[node.attribValueStartsAt] ===
          context.str[node.attribOpeningQuoteAt]
      ) {
        console.log(
          `142 ${`\u001b[${31}m${`REPEATED OPENING QUOTES`}\u001b[${39}m`}`
        );
        const message = `Delete repeated opening quotes.`;
        context.report({
          ruleId: "attribute-malformed",
          message,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            // delete the character
            ranges: [[node.attribValueStartsAt, node.attribValueStartsAt + 1]],
          },
        });
      }

      // repeated closing quotes
      if (
        node.attribValueRaw &&
        // value ends with a quote
        (node.attribValueRaw.endsWith(`"`) ||
          node.attribValueRaw.endsWith(`'`)) &&
        node.attribValueEndsAt &&
        node.attribClosingQuoteAt &&
        context.str[node.attribValueEndsAt] ===
          context.str[node.attribClosingQuoteAt]
      ) {
        console.log(
          `169 ${`\u001b[${31}m${`REPEATED CLOSING QUOTES`}\u001b[${39}m`}`
        );
        const message = `Delete repeated closing quotes.`;
        context.report({
          ruleId: "attribute-malformed",
          message,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            // delete the character
            ranges: [[node.attribValueEndsAt - 1, node.attribValueEndsAt]],
          },
        });
      }

      // maybe some quotes are missing?
      const ranges: Range[] = [];
      if (
        node.attribOpeningQuoteAt === null &&
        node.attribValueStartsAt !== null
      ) {
        console.log(
          `191 ${`\u001b[${31}m${`OPENING QUOTE MISSING`}\u001b[${39}m`}`
        );
        ranges.push([
          node.attribValueStartsAt,
          node.attribValueStartsAt,
          node.attribClosingQuoteAt === null
            ? `"`
            : context.str[node.attribClosingQuoteAt],
        ]);
      }

      if (
        node.attribClosingQuoteAt === null &&
        node.attribValueEndsAt !== null
      ) {
        console.log(
          `207 ${`\u001b[${31}m${`CLOSING QUOTE MISSING`}\u001b[${39}m`}`
        );
        ranges.push([
          node.attribValueEndsAt,
          node.attribValueEndsAt,
          node.attribOpeningQuoteAt === null
            ? `"`
            : context.str[node.attribOpeningQuoteAt],
        ]);
      }
      if (ranges.length) {
        console.log(`218 RAISE ERROR ABOUT QUOTES`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Quote${ranges.length > 1 ? "s are" : " is"} missing.`,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: { ranges },
        });
      }

      // maybe quotes are mismatching?
      if (
        node.attribOpeningQuoteAt !== null &&
        node.attribClosingQuoteAt !== null &&
        context.str[node.attribOpeningQuoteAt] !==
          context.str[node.attribClosingQuoteAt]
      ) {
        console.log(
          `236 ${`\u001b[${31}m${`MISMATCHING QUOTES`}\u001b[${39}m`}`
        );
        // default is double quotes; if content doesn't have them, that's what
        // we're going to use
        if (!node.attribValueRaw.includes(`"`)) {
          console.log(`241 attr value doesn't have double quotes`);
          context.report({
            ruleId: "attribute-malformed",
            message: `${
              context.str[node.attribClosingQuoteAt] === `"`
                ? "Opening"
                : "Closing"
            } quote should be double.`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [
                context.str[node.attribClosingQuoteAt] === `"`
                  ? [
                      node.attribOpeningQuoteAt,
                      node.attribOpeningQuoteAt + 1,
                      `"`,
                    ]
                  : [
                      node.attribClosingQuoteAt,
                      node.attribClosingQuoteAt + 1,
                      `"`,
                    ],
              ],
            },
          });
        } else if (!node.attribValueRaw.includes(`'`)) {
          console.log(`268 attr value has double quote but not single`);
          context.report({
            ruleId: "attribute-malformed",
            message: `${
              context.str[node.attribClosingQuoteAt] === `'`
                ? "Opening"
                : "Closing"
            } quote should be single.`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [
                context.str[node.attribClosingQuoteAt] === `'`
                  ? [
                      node.attribOpeningQuoteAt,
                      node.attribOpeningQuoteAt + 1,
                      `'`,
                    ]
                  : [
                      node.attribClosingQuoteAt,
                      node.attribClosingQuoteAt + 1,
                      `'`,
                    ],
              ],
            },
          });
        } else {
          console.log(`295 attr value has both double and single quotes`);
        }
      }
    },
  };
}

export default attributeMalformed;
