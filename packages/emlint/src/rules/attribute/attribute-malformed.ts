import { Linter, RuleObjType } from "../../linter";
import { Range } from "../../../../../scripts/common";

import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";
import { isAnEnabledValue } from "../../util/util";
import { left } from "string-left-right";

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

      if (
        // exclude ESP tags, comment tokens etc etc.
        node.attribName === undefined
      ) {
        console.log(`031 early bail, this is not an attribute token`);
        return;
      }

      // if Levenshtein distance is 1 and it's not among known attribute names,
      // it's definitely mis-typed
      if (
        !node.attribNameRecognised &&
        node.attribName &&
        !node.attribName.startsWith("xmlns:") &&
        !blacklist.includes(node.parent.tagName as string)
      ) {
        console.log(
          `044 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );

        let somethingMatched = false;

        for (const oneOfAttribs of allHtmlAttribs.values()) {
          if (oneOfAttribs === node.attribName.toLowerCase()) {
            // only the letter case is wrong, for example
            // <img SRC="spacer.gif" ALT=""/>
            console.log(`053 RAISE ERROR`);
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
            console.log(`074 RAISE ERROR`);
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
            `098 RAISE ERROR, [${node.attribNameStartsAt}, ${node.attribNameEndsAt}]`
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
        console.log(`119`);
        if (
          // if opening quotes are present, let's use their location
          node.attribOpeningQuoteAt !== null &&
          context.str.slice(
            node.attribNameEndsAt,
            node.attribOpeningQuoteAt
          ) !== "="
        ) {
          console.log(`128`);
          let message = `Malformed around equal.`;
          if (
            !context.str
              .slice(node.attribNameEndsAt, node.attribOpeningQuoteAt)
              .includes("=")
          ) {
            console.log(
              `136 ${`\u001b[${31}m${`EQUAL MISSING`}\u001b[${39}m`}`
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
            `152 ${`\u001b[${31}m${`RAISE ERROR ABOUT EQUALS SIGN`}\u001b[${39}m`}`
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
          `180 ${`\u001b[${31}m${`REPEATED OPENING QUOTES`}\u001b[${39}m`}`
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
          `207 ${`\u001b[${31}m${`REPEATED CLOSING QUOTES`}\u001b[${39}m`}`
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
          `229 attributeMalformed(): ${`\u001b[${31}m${`OPENING QUOTE MISSING`}\u001b[${39}m`}`
        );
        let valueToPut = `"`;
        if (
          node.attribClosingQuoteAt &&
          `'"`.includes(context.str[node.attribClosingQuoteAt])
        ) {
          valueToPut = context.str[node.attribClosingQuoteAt];
        }
        console.log(`238 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        ranges.push([
          (left(context.str, node.attribValueStartsAt) as number) + 1,
          node.attribValueStartsAt,
          valueToPut,
        ]);

        // check the closing-one
        if (
          node.attribClosingQuoteAt &&
          !`'"`.includes(context.str[node.attribClosingQuoteAt])
        ) {
          console.log(`250 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          ranges.push([
            node.attribClosingQuoteAt,
            node.attribClosingQuoteAt + 1,
            valueToPut,
          ]);
        }
      }

      if (node.attribClosingQuoteAt === null) {
        if (node.attribValueEndsAt !== null) {
          console.log(
            `262 attributeMalformed(): ${`\u001b[${31}m${`CLOSING QUOTE MISSING, VALUE PRESENT`}\u001b[${39}m`}`
          );
          let valueToPut = `"`;
          if (
            node.attribOpeningQuoteAt &&
            `'"`.includes(context.str[node.attribOpeningQuoteAt])
          ) {
            valueToPut = context.str[node.attribOpeningQuoteAt];
          }

          console.log(`272 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          // consume the frontal whitespace, if any:
          ranges.push([
            (left(context.str, node.attribValueEndsAt) as number) + 1,
            node.attribValueEndsAt,
            valueToPut,
          ]);

          // check the opening-one
          if (
            node.attribOpeningQuoteAt &&
            !`'"`.includes(context.str[node.attribOpeningQuoteAt])
          ) {
            console.log(
              `286 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} at ${
                node.attribOpeningQuoteAt
              }`
            );
            ranges.push([
              node.attribOpeningQuoteAt,
              node.attribOpeningQuoteAt + 1,
              valueToPut,
            ]);
          }
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
            console.log(`307 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
            ranges.push([
              node.attribOpeningQuoteAt,
              node.attribOpeningQuoteAt + 1,
              `""`,
            ]);
          } else {
            // add a counterpart, single or double
            console.log(
              `316 attributeMalformed(): ${`\u001b[${31}m${`CLOSING QUOTE MISSING, TAG ABRUPTLY ENDS`}\u001b[${39}m`}`
            );
            console.log(`318 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
            // Instead of pushing into new position after opening quote,
            // replace opening quote with two quotes. This will solve
            // issues when rules that follow will compound - sorting will
            // treat this range as early because it started earlier, at
            // the opening quote. Imagine:
            // <img alt=">
            //           ^
            //      slash, gap and quote - 3 rules competing
            //
            ranges.push([
              node.attribOpeningQuoteAt,
              node.attribOpeningQuoteAt + 1,
              `${context.str[node.attribOpeningQuoteAt]}${
                context.str[node.attribOpeningQuoteAt] || `"`
              }`,
            ]);
          }
        }
      }
      if (ranges.length) {
        console.log(`339 attributeMalformed(): RAISE ERROR ABOUT QUOTES`);
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
        console.log(`353 attributeMalformed(): quote checks`);

        if (!`'"`.includes(context.str[node.attribOpeningQuoteAt])) {
          // if the opening quote is just wrong, then we'll use doubles
          console.log(`357 attributeMalformed(): opening quote is wrong`);
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
            console.log(`372 attributeMalformed(): closing quote is wrong`);
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
          console.log(`397 attributeMalformed(): closing quote is mismatching`);

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
              `411 attributeMalformed(): set opening quote to be double`
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
                `432 attributeMalformed(): set closing quote to be double`
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
              `452 attributeMalformed(): use singles as means for escaping doubles within a value`
            );
            if (context.str[node.attribOpeningQuoteAt] !== `'`) {
              console.log(
                `456 attributeMalformed(): set opening quote to be single`
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
                `476 attributeMalformed(): set closing quote to be single`
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
              `496 attributeMalformed(): set the closing quote to be like opening`
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
              `535 attributeMalformed(): escape doubles within a value`
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
              `554 attributeMalformed(): use the opposite type of quotes`
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

      // check the whitespace in front of an attribute
      // <span class="x"id="left">
      //                ^
      if (
        node.parent.pureHTML &&
        node.attribLeft &&
        node.attribStarts &&
        (node.attribLeft + 2 !== node.attribStarts ||
          context.str[node.attribStarts - 1] !== " ")
      ) {
        console.log(`602 whitespace missing`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Add a space.`,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges: [[node.attribLeft + 1, node.attribStarts, " "]],
          },
        });
      }
    },
  };
}

export default attributeMalformed;
