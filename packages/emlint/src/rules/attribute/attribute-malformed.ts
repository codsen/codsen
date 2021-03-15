import { Linter, RuleObjType } from "../../linter";
import { allHtmlAttribs } from "html-all-known-attributes";
import leven from "leven";
import { left } from "string-left-right";

// rule: attribute-malformed
// -----------------------------------------------------------------------------

// it flags up malformed HTML attributes

type Config = "useSingleToEscapeDouble";

function attributeMalformed(context: Linter, ...config: Config[]): RuleObjType {
  // the following tags will be processed separately
  const blacklist = ["doctype"];

  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeMalformed() ███████████████████████████████████████`
      );
      console.log(
        `023 ${`\u001b[${33}m${`config`}\u001b[${39}m`} = ${JSON.stringify(
          config,
          null,
          4
        )}`
      );
      console.log(
        `030 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      let inTheEndUseDoubles = true;
      if (
        config.includes("useSingleToEscapeDouble") &&
        node.attribValueRaw.includes(`"`) &&
        !node.attribValueRaw.includes(`'`) &&
        // it's not leading or trailing
        !node.attribValueRaw.trim().startsWith(`"`) &&
        !node.attribValueRaw.trim().endsWith(`"`)
      ) {
        inTheEndUseDoubles = false;
      }
      console.log(
        `045 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`inTheEndUseDoubles`}\u001b[${39}m`} = ${JSON.stringify(
          inTheEndUseDoubles,
          null,
          4
        )}`
      );

      let repeatedQuotesPresent = false;

      if (
        // exclude ESP tags etc.
        node.attribName === undefined
      ) {
        console.log(`058 early bail, this is not an attribute token`);
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
          `071 attributeMalformed(): ${`\u001b[${31}m${`unrecognised attr name!`}\u001b[${39}m`}`
        );

        let somethingMatched = false;

        for (const oneOfAttribs of allHtmlAttribs.values()) {
          if (oneOfAttribs === node.attribName.toLowerCase()) {
            // only the letter case is wrong, for example
            // <img SRC="spacer.gif" ALT=""/>
            console.log(`080 RAISE ERROR`);
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
            console.log(`101 RAISE ERROR`);
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
            `125 RAISE ERROR, [${node.attribNameStartsAt}, ${node.attribNameEndsAt}]`
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
        console.log(`146`);
        if (
          // if opening quotes are present, let's use their location
          node.attribOpeningQuoteAt !== null &&
          context.str.slice(
            node.attribNameEndsAt,
            node.attribOpeningQuoteAt
          ) !== "="
        ) {
          console.log(`155`);
          let message = `Malformed around equal.`;
          if (
            !context.str
              .slice(node.attribNameEndsAt, node.attribOpeningQuoteAt)
              .includes("=")
          ) {
            console.log(
              `163 ${`\u001b[${31}m${`EQUAL MISSING`}\u001b[${39}m`}`
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
            `179 ${`\u001b[${31}m${`RAISE ERROR ABOUT EQUALS SIGN`}\u001b[${39}m`}`
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
          `207 ${`\u001b[${31}m${`REPEATED OPENING QUOTES`}\u001b[${39}m`}`
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

        repeatedQuotesPresent = true;
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
          `236 ${`\u001b[${31}m${`REPEATED CLOSING QUOTES`}\u001b[${39}m`}`
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

        repeatedQuotesPresent = true;
      }

      // check the opening quote
      if (
        context.str[node.attribOpeningQuoteAt as number] !==
        (inTheEndUseDoubles ? `"` : `'`)
      ) {
        // does it exist?
        if (node.attribOpeningQuoteAt) {
          console.log(`260 attributeMalformed(): wrong opening quote`);
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
                  inTheEndUseDoubles ? `"` : `'`,
                ],
              ],
            },
          });
        } else if (node.attribValueStartsAt) {
          console.log(`277 attributeMalformed(): missing opening quote`);
          context.report({
            ruleId: "attribute-malformed",
            message: `Add an opening quote.`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [
                [
                  (left(context.str, node.attribValueStartsAt) as number) + 1,
                  node.attribValueStartsAt,
                  inTheEndUseDoubles ? `"` : `'`,
                ],
              ],
            },
          });
        }
      }

      // check the closing quote
      if (
        context.str[node.attribClosingQuoteAt as number] !==
        (inTheEndUseDoubles ? `"` : `'`)
      ) {
        if (node.attribClosingQuoteAt) {
          console.log(`302 attributeMalformed(): wrong closing quote`);
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
                  inTheEndUseDoubles ? `"` : `'`,
                ],
              ],
            },
          });
        } else if (node.attribValueEndsAt || node.attribOpeningQuoteAt) {
          console.log(`319 attributeMalformed(): missing closing quote`);
          // if the is no value, only opening quote:
          // <img alt="/>
          // value will be null, so we use opening quote's position instead

          let startPos = node.attribOpeningQuoteAt;
          if (node.attribValueStartsAt) {
            // correction for trailing whitespace,
            // <div class=“foo\n>z</div>
            //                ^^
            startPos =
              node.attribValueStartsAt + node.attribValueRaw.trimEnd().length;
          }

          context.report({
            ruleId: "attribute-malformed",
            message: `Add a closing quote.`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [
                [
                  startPos as number,
                  (node.attribValueEndsAt ||
                    node.attribOpeningQuoteAt) as number,
                  inTheEndUseDoubles ? `"` : `'`,
                ],
              ],
            },
          });
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
        console.log(`362 whitespace missing`);
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

      // finally, check, do the attribute contents need to be encoded
      if (
        !repeatedQuotesPresent &&
        node.attribValueStartsAt &&
        node.attribValueEndsAt &&
        typeof node.attribValueRaw === "string" &&
        ((inTheEndUseDoubles && node.attribValueRaw.includes(`"`)) ||
          (!inTheEndUseDoubles && node.attribValueRaw.includes(`'`)))
      ) {
        console.log(
          `384 ${`\u001b[${31}m${`unencoded quotes present within the value!`}\u001b[${39}m`}`
        );
        node.attribValueRaw.split("").forEach((char, idx) => {
          if (char === (inTheEndUseDoubles ? `"` : "'")) {
            console.log(`388 whitespace missing`);
            context.report({
              ruleId: "attribute-malformed",
              message: `Unencoded quote.`,
              idxFrom: node.attribValueStartsAt as number,
              idxTo: node.attribValueEndsAt as number,
              fix: {
                ranges: [
                  [
                    (node.attribValueStartsAt as number) + idx,
                    (node.attribValueStartsAt as number) + idx + 1,
                    inTheEndUseDoubles ? `&quot;` : `&apos;`,
                  ],
                ],
              },
            });
          }
        });
      }
    },
  };
}

export default attributeMalformed;
