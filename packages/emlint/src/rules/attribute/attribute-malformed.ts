import { Linter, RuleObjType } from "../../linter";
import { Range } from "../../../../../scripts/common";

import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";
import { isAnEnabledValue } from "../../util/util";
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
        `024 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
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
          `036 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );

        let somethingMatched = false;

        for (const oneOfAttribs of allHtmlAttribs.values()) {
          if (oneOfAttribs === node.attribName.toLowerCase()) {
            // only the letter case is wrong, for example
            // <img SRC="spacer.gif" ALT=""/>
            console.log(`045 RAISE ERROR`);
            context.report({
              ruleId: "attribute-malformed",
              message: `Should be lowercase.`,
              idxFrom: node.attribNameStartsAt,
              idxTo: node.attribNameEndsAt, // second elem. from last range
              fix: {
                ranges: [
                  [
                    node.attribNameStartsAt,
                    node.attribNameEndsAt,
                    oneOfAttribs.toLowerCase(),
                  ],
                ],
              },
            });
            somethingMatched = true;
            break;
          } else if (leven(oneOfAttribs, node.attribName) === 1) {
            // <img srcc="spacer.gif" altt=""/>
            //         ^                 ^
            console.log(`066 RAISE ERROR`);
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
            `090 RAISE ERROR, [${node.attribNameStartsAt}, ${node.attribNameEndsAt}]`
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

      // something wrong around equal
      if (
        node.attribNameEndsAt &&
        (node.attribValueStartsAt ||
          // it's an empty value
          (node.attribOpeningQuoteAt &&
            node.attribClosingQuoteAt &&
            node.attribClosingQuoteAt === node.attribOpeningQuoteAt + 1))
      ) {
        console.log(`111`);
        if (
          // if opening quotes are present, let's use their location
          node.attribOpeningQuoteAt !== null &&
          context.str.slice(
            node.attribNameEndsAt,
            node.attribOpeningQuoteAt
          ) !== "="
        ) {
          console.log(`120`);
          let message = `Malformed around equal.`;
          if (
            !context.str
              .slice(node.attribNameEndsAt, node.attribOpeningQuoteAt)
              .includes("=")
          ) {
            console.log(
              `128 ${`\u001b[${31}m${`EQUAL MISSING`}\u001b[${39}m`}`
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
            `144 ${`\u001b[${31}m${`RAISE ERROR ABOUT EQUALS SIGN`}\u001b[${39}m`}`
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
          `172 ${`\u001b[${31}m${`REPEATED OPENING QUOTES`}\u001b[${39}m`}`
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
          `199 ${`\u001b[${31}m${`REPEATED CLOSING QUOTES`}\u001b[${39}m`}`
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
          `221 attributeMalformed(): ${`\u001b[${31}m${`OPENING QUOTE MISSING`}\u001b[${39}m`}`
        );
        ranges.push([
          node.attribValueStartsAt,
          node.attribValueStartsAt,
          node.attribClosingQuoteAt === null
            ? `"`
            : context.str[node.attribClosingQuoteAt],
        ]);
      }

      if (node.attribClosingQuoteAt === null) {
        if (node.attribValueEndsAt !== null) {
          console.log(
            `235 attributeMalformed(): ${`\u001b[${31}m${`CLOSING QUOTE MISSING, VALUE PRESENT`}\u001b[${39}m`}`
          );
          ranges.push([
            node.attribValueEndsAt,
            node.attribValueEndsAt,
            node.attribOpeningQuoteAt === null
              ? `"`
              : context.str[node.attribOpeningQuoteAt],
          ]);
        } else if (node.attribOpeningQuoteAt) {
          if (
            // if format-prettier is enabled
            Object.keys(context.processedRulesConfig).includes(
              "format-prettier"
            ) &&
            isAnEnabledValue(context.processedRulesConfig["format-prettier"]) &&
            // opening quote is single
            context.str[node.attribOpeningQuoteAt] === "'"
          ) {
            // replace that opening quote with two doubles
            ranges.push([
              node.attribOpeningQuoteAt,
              node.attribOpeningQuoteAt + 1,
              `""`,
            ]);
          } else {
            // add a counterpart, single or double
            console.log(
              `263 attributeMalformed(): ${`\u001b[${31}m${`CLOSING QUOTE MISSING, TAG ABRUPTLY ENDS`}\u001b[${39}m`}`
            );
            ranges.push([
              node.attribOpeningQuoteAt + 1,
              node.attribOpeningQuoteAt + 1,
              context.str[node.attribOpeningQuoteAt] || `"`,
            ]);
          }
        }
      }
      if (ranges.length) {
        console.log(`274 attributeMalformed(): RAISE ERROR ABOUT QUOTES`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Quote${ranges.length > 1 ? "s are" : " is"} missing.`,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: { ranges },
        });
      }

      if (
        node.attribOpeningQuoteAt !== null &&
        node.attribClosingQuoteAt !== null
      ) {
        console.log(`288 attributeMalformed(): quote checks`);

        if (!`'"`.includes(context.str[node.attribOpeningQuoteAt])) {
          // if the opening quote is just wrong, then we'll use doubles
          console.log(`292 attributeMalformed(): opening quote is wrong`);
          context.report({
            ruleId: "attribute-malformed",
            message: `Wrong opening quote.`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [
                [node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, `"`],
              ],
            },
          });

          // check the closing quote
          if (context.str[node.attribClosingQuoteAt] !== `"`) {
            console.log(`307 attributeMalformed(): closing quote is wrong`);
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong closing quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [
                  [
                    node.attribClosingQuoteAt,
                    node.attribClosingQuoteAt + 1,
                    `"`,
                  ],
                ],
              },
            });
          }
        } else if (
          context.str[node.attribOpeningQuoteAt] !==
            context.str[node.attribClosingQuoteAt] ||
          (node.attribValueRaw.includes(`'`) &&
            // avoid repeated quote cases:
            !node.attribValueRaw.startsWith(`'`) &&
            !node.attribValueRaw.endsWith(`'`))
        ) {
          console.log(`332 attributeMalformed(): closing quote is mismatching`);

          // if format-prettier is enabled, use a double for both
          if (
            ((Object.keys(context.processedRulesConfig).includes(
              "format-prettier"
            ) &&
              isAnEnabledValue(
                context.processedRulesConfig["format-prettier"]
              )) ||
              node.attribValueRaw.includes(`'`)) &&
            context.str[node.attribOpeningQuoteAt] !== `"`
          ) {
            console.log(
              `346 attributeMalformed(): set opening quote to be double`
            );
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong opening quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [
                  [
                    node.attribOpeningQuoteAt,
                    node.attribOpeningQuoteAt + 1,
                    `"`,
                  ],
                ],
              },
            });

            // check closing-one too
            if (context.str[node.attribClosingQuoteAt] !== `"`) {
              console.log(
                `367 attributeMalformed(): set closing quote to be double`
              );
              context.report({
                ruleId: "attribute-malformed",
                message: `Wrong closing quote.`,
                idxFrom: node.attribStarts,
                idxTo: node.attribEnds,
                fix: {
                  ranges: [
                    [
                      node.attribClosingQuoteAt,
                      node.attribClosingQuoteAt + 1,
                      `"`,
                    ],
                  ],
                },
              });
            }
          } else if (node.attribValueRaw.includes(`"`)) {
            console.log(
              `387 attributeMalformed(): use singles as means for escaping doubles within a value`
            );
            if (context.str[node.attribOpeningQuoteAt] !== `'`) {
              console.log(
                `391 attributeMalformed(): set opening quote to be single`
              );
              context.report({
                ruleId: "attribute-malformed",
                message: `Wrong opening quote.`,
                idxFrom: node.attribStarts,
                idxTo: node.attribEnds,
                fix: {
                  ranges: [
                    [
                      node.attribOpeningQuoteAt,
                      node.attribOpeningQuoteAt + 1,
                      `'`,
                    ],
                  ],
                },
              });
            }
            if (context.str[node.attribClosingQuoteAt] !== `'`) {
              console.log(
                `411 attributeMalformed(): set closing quote to be single`
              );
              context.report({
                ruleId: "attribute-malformed",
                message: `Wrong closing quote.`,
                idxFrom: node.attribStarts,
                idxTo: node.attribEnds,
                fix: {
                  ranges: [
                    [
                      node.attribClosingQuoteAt,
                      node.attribClosingQuoteAt + 1,
                      `'`,
                    ],
                  ],
                },
              });
            }
          } else {
            console.log(
              `431 attributeMalformed(): set the closing quote to be like opening`
            );
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong closing quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [
                  [
                    node.attribClosingQuoteAt,
                    node.attribClosingQuoteAt + 1,
                    context.str[node.attribOpeningQuoteAt],
                  ],
                ],
              },
            });
          }
        } else if (
          context.str[node.attribOpeningQuoteAt] ===
            context.str[node.attribClosingQuoteAt] &&
          node.attribValueRaw.includes(
            context.str[node.attribOpeningQuoteAt]
          ) &&
          // avoid duplicate quote cases
          !node.attribValueRaw.startsWith(
            context.str[node.attribOpeningQuoteAt]
          ) &&
          !node.attribValueRaw.endsWith(context.str[node.attribOpeningQuoteAt])
        ) {
          // <img alt="so-called "artists"!"/>
          //                     ^       ^
          if (
            Object.keys(context.processedRulesConfig).includes(
              "format-prettier"
            ) &&
            isAnEnabledValue(context.processedRulesConfig["format-prettier"])
          ) {
            console.log(
              `470 attributeMalformed(): escape doubles within a value`
            );
            context.report({
              ruleId: "attribute-malformed",
              message: `Encode the double quotes.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [
                  [
                    node.attribValueStartsAt as number,
                    node.attribValueEndsAt as number,
                    node.attribValueRaw.replace(/"/g, "&quot;"),
                  ],
                ],
              },
            });
          } else {
            console.log(
              `489 attributeMalformed(): use the opposite type of quotes`
            );
            const valueToSet =
              context.str[node.attribOpeningQuoteAt] === `"` ? `'` : `"`;
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong opening quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [
                  [
                    node.attribOpeningQuoteAt,
                    node.attribOpeningQuoteAt + 1,
                    valueToSet,
                  ],
                ],
              },
            });
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong closing quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [
                  [
                    node.attribClosingQuoteAt,
                    node.attribClosingQuoteAt + 1,
                    valueToSet,
                  ],
                ],
              },
            });
          }
        }
      }
    },
  };
}

export default attributeMalformed;
