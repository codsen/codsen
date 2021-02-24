import { Linter, RuleObjType } from "../../linter";
import { Property } from "../../../../codsen-tokenizer/src/util/util";
// import { Range } from "../../../../../scripts/common";

// rule: css-rule-malformed
// -----------------------------------------------------------------------------

// import { rMerge } from "ranges-merge";
// import { right } from "string-left-right";
// import splitByWhitespace from "../../util/splitByWhitespace";

interface cssRuleMalformed {
  (context: Linter): RuleObjType;
}
const cssRuleMalformed: cssRuleMalformed = (context) => {
  return {
    rule(node) {
      console.log(
        `███████████████████████████████████████ cssRuleMalformed() ███████████████████████████████████████`
      );
      console.log(
        `022 cssRuleMalformed(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // 0. extract all properties - node.properties array records
      // all whitespace as text tokens and we want to exclude them

      let properties: Property[] = [];
      // there can be text nodes within properties array!
      // innocent whitespace is still a text node!!!!
      if (
        Array.isArray(node.properties) &&
        node.properties.length &&
        node.properties.filter((property) => (property as any).property).length
      ) {
        properties = (node.properties as Property[]).filter(
          (property) => (property as any).property !== undefined
        );
      }
      console.log(
        `045 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
          properties as any,
          null,
          4
        )}`
      );

      // 1. catch missing semi on all rules except last
      // <style>.a{color:red\n\ntext-align:left
      //                   ^

      if (properties && properties.length) {
        console.log(`057`);
        // Iterate starting from the second-to last.
        // The last property is ambiguous, tackled by a separate rule.
        for (let i = properties.length - 1; i--; ) {
          if (properties[i].semi === null && properties[i].value) {
            //
            console.log(
              `064 ${`\u001b[${31}m${`missing semi on ${properties[i].property}`}\u001b[${39}m`}`
            );
            context.report({
              ruleId: "css-rule-malformed",
              idxFrom: properties[i].start,
              idxTo: properties[i].end,
              message: `Add a semicolon.`,
              fix: {
                ranges: [[properties[i].end, properties[i].end, ";"]],
              },
            });
          }
        }
      }

      // 2. various checks
      // =================

      if (node.properties && node.properties.length) {
        console.log(`083`);
        (node.properties as Property[]).forEach((property) => {
          // 2-1. catch rules with malformed !important
          // <style>.a{color:red !impotant;}</style>
          //                         ^^

          if (property.important && property.important !== "!important") {
            console.log(`090 malformed !important`);
            context.report({
              ruleId: "css-rule-malformed",
              idxFrom: (property as any).importantStarts,
              idxTo: (property as any).importantEnds,
              message: `Malformed !important.`,
              fix: {
                ranges: [
                  [
                    (property as any).importantStarts,
                    (property as any).importantEnds,
                    "!important",
                  ],
                ],
              },
            });
          }

          // 2-2 catch gaps in front of colon
          // <style>.a{ color : red; }</style>
          //                 ^

          if (
            property.colon &&
            property.propertyEnds &&
            (property.propertyEnds as number) < (property.colon as number)
          ) {
            console.log(
              `118 ${`\u001b[${31}m${`rogue gap in front of colon ${property.property}`}\u001b[${39}m`}`
            );
            context.report({
              ruleId: "css-rule-malformed",
              idxFrom: property.start,
              idxTo: property.end,
              message: `Gap in front of semicolon.`,
              fix: {
                ranges: [
                  [property.propertyEnds as number, property.colon as number],
                ],
              },
            });
          }

          // 2-3 catch gaps in front of semi
          // <style>.a{ color: red ; }</style>
          //                      ^

          if (
            property.semi &&
            ((property.importantEnds || property.valueEnds) as number) &&
            ((property.importantEnds || property.valueEnds) as number) <
              (property.semi as number)
          ) {
            console.log(
              `144 ${`\u001b[${31}m${`rogue gap in front of semi ${property.property}`}\u001b[${39}m`}`
            );
            context.report({
              ruleId: "css-rule-malformed",
              idxFrom: property.start,
              idxTo: property.end,
              message: `Gap in front of semi.`,
              fix: {
                ranges: [
                  [
                    (property.importantEnds as number) ||
                      (property.valueEnds as number),
                    property.semi as number,
                  ],
                ],
              },
            });
          }
        });
      }

      // 3. catch css rules with selectors but without properties
      // <style>.a{;}
      //           ^

      if (
        Array.isArray(node.selectors) &&
        node.selectors.length &&
        !properties.length &&
        node.openingCurlyAt &&
        node.closingCurlyAt &&
        node.closingCurlyAt > node.openingCurlyAt + 1 &&
        context.str.slice(node.openingCurlyAt + 1, node.closingCurlyAt).trim()
      ) {
        console.log(
          `179 ${`\u001b[${31}m${`something rogue inside ${node.value}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId: "css-rule-malformed",
          idxFrom: node.start,
          idxTo: node.end,
          message: `Delete rogue character${
            context.str
              .slice(node.openingCurlyAt + 1, node.closingCurlyAt)
              .trim().length > 1
              ? "s"
              : ""
          }.`,
          fix: {
            ranges: [[node.openingCurlyAt + 1, node.closingCurlyAt]],
          },
        });
      }

      // 4. catch css properties without values
      // <style>.a{color:}</style>
      //                ^

      if (node.properties && Array.isArray(node.properties)) {
        for (let i = 0, len = node.properties.length; i < len; i++) {
          console.log(
            `205 ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              node.properties[i],
              null,
              4
            )}`
          );
          if (node.properties[i].value === null) {
            // tend a rare case, a rogue semicolon:
            // <style>.a{color:red; !important;}</style>
            //                    ^
            if (
              (node.properties[i] as Property).important !== null &&
              (node.properties[i] as Property).property === null
            ) {
              console.log(
                `220 ${`\u001b[${31}m${`██`}\u001b[${39}m`} no value, no property`
              );

              let errorRaised = false;
              if (i) {
                for (let y = node.properties.length; y--; ) {
                  if (y === i) {
                    console.log(`227 skip thyself`);
                    continue;
                  }
                  console.log(
                    `231 - property: ${JSON.stringify(
                      node.properties[y],
                      null,
                      4
                    )}`
                  );
                  if (
                    // the property we're talking about is missing both
                    // value and property, yet it contains !important
                    (node.properties[i] as Property).important &&
                    !(node.properties[i] as Property).propertyStarts &&
                    !(node.properties[i] as Property).valueStarts &&
                    // we're traversing upon a CSS property, not a whitespace text token
                    (node.properties[y] as any).property !== undefined
                  ) {
                    console.log(`246`);
                    if (
                      // its semi is present
                      (node.properties[y] as any).semi &&
                      // and its important is missing
                      !(node.properties[y] as any).importantStarts
                    ) {
                      console.log(`253`);
                      // the frontal space might be missing
                      const fromIdx = (node.properties[y] as any).semi;
                      const toIdx = (node.properties[y] as any).semi + 1;
                      let whatToInsert;
                      if (
                        context.str[(node.properties[y] as any).semi + 1] !==
                        " "
                      ) {
                        whatToInsert = " ";
                      }

                      console.log(`265 report [${fromIdx}, ${toIdx}]`);
                      context.report({
                        ruleId: "css-rule-malformed",
                        idxFrom: fromIdx,
                        idxTo: toIdx,
                        message: `Delete the semicolon.`,
                        fix: {
                          ranges: [[fromIdx, toIdx, whatToInsert]],
                        },
                      });

                      errorRaised = true;
                      console.log(
                        `278 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`errorRaised`}\u001b[${39}m`} = ${JSON.stringify(
                          errorRaised,
                          null,
                          4
                        )}`
                      );
                    } else {
                      // stop looping further
                      console.log(
                        `287 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
                      );
                      break;
                    }
                  }
                }
              }

              if (
                // it's a property token, not text whitespace token:
                (node.properties[i] as Property).property !== undefined &&
                // and error hasn't been raised so far:
                !errorRaised
              ) {
                console.log(`301 report missing value`);
                context.report({
                  ruleId: "css-rule-malformed",
                  idxFrom: node.properties[i].start,
                  idxTo: node.properties[i].end,
                  message: `Missing value.`,
                  fix: null,
                });
              }
            } else {
              console.log(
                `312 ${`\u001b[${31}m${`██`}\u001b[${39}m`} simply no value`
              );
              context.report({
                ruleId: "css-rule-malformed",
                idxFrom: node.properties[i].start,
                idxTo: node.properties[i].end,
                message: `Missing value.`,
                fix: null,
              });
            }
          }
        }
      }

      console.log(
        `327 ${`\u001b[${32}m${`END of css-rule-malformed`}\u001b[${39}m`}`
      );
    },
  };
};

export default cssRuleMalformed;
