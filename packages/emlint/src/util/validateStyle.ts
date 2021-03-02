import { Linter } from "../linter";
import { RuleToken, Property } from "../../../codsen-tokenizer/src/util/util";
// import checkForWhitespace from "./checkForWhitespace";
import { AttribSupplementedWithParent } from "./commonTypes";

/**
 * Used for both inline HTML tag styles and head CSS style tag rules
 */
function validateStyle(
  token: RuleToken | AttribSupplementedWithParent,
  context: Linter
): void {
  // first let's set the properties array container, it might come
  // from different places, depending is it head CSS styles or inline HTML styles
  let nodeArr;
  let ruleId = "";
  if ((token as any).properties !== undefined) {
    // head CSS rule
    nodeArr = (token as any).properties;
    ruleId = "css-rule-malformed";
  } else if ((token as any).attribValue !== undefined) {
    // inline HTML style attribute
    nodeArr = (token as any).attribValue;
    ruleId = "attribute-validate-style";
  }

  if (!nodeArr || !ruleId) {
    console.log(
      `029 validateStyle(): ${`\u001b[${31}m${`early exit`}\u001b[${39}m`}`
    );
    return;
  }

  console.log(
    `035 validateStyle(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nodeArr`}\u001b[${39}m`} = ${JSON.stringify(
      nodeArr,
      null,
      4
    )}`
  );

  // extract all properties - arr array records
  // all whitespace as text tokens and we want to exclude them

  let properties: Property[] = [];
  // there can be text nodes within properties array!
  // a whitespace is still a text node!!!!
  if (
    (nodeArr as Property[]).some((property) => property.property !== undefined)
  ) {
    properties = (nodeArr as any).filter(
      (property: any) => (property as any).property !== undefined
    );
  }
  console.log(
    `056 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
      properties as any,
      null,
      4
    )}`
  );

  if (properties && properties.length) {
    console.log(`064 validateStyle()`);

    // 1. catch missing semi on all rules except last
    // <style>.a{color:red\n\ntext-align:left
    //                   ^
    //
    // Iterate starting from the second-to last.
    // The last property is ambiguous, tackled by a separate rule.

    for (let i = properties.length - 1; i--; ) {
      if (properties[i].semi === null && properties[i].value) {
        //
        console.log(
          `077 validateStyle() ${`\u001b[${31}m${`missing semi on ${properties[i].property}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId,
          idxFrom: properties[i].start,
          idxTo: properties[i].end,
          message: `Add a semicolon.`,
          fix: {
            ranges: [[properties[i].end, properties[i].end, ";"]],
          },
        });
      }
    }

    properties.forEach((property) => {
      // 2. catch rules with malformed !important
      // <style>.a{color:red !impotant;}</style>
      //                         ^^

      if (
        (property as any).important &&
        (property as any).important !== "!important"
      ) {
        console.log(`100 validateStyle() malformed !important`);
        context.report({
          ruleId,
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

      // 3 catch gaps in front of colon
      // <style>.a{ color : red; }</style>
      //                 ^

      if (
        property.colon &&
        property.propertyEnds &&
        (property.propertyEnds as number) < (property.colon as number)
      ) {
        console.log(
          `128 validateStyle() ${`\u001b[${31}m${`rogue gap in front of colon ${property.property}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId,
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

      // 4 catch gaps in front of semi
      // <style>.a{ color: red ; }</style>
      //                      ^

      if (
        property.semi &&
        ((property.importantEnds || property.valueEnds) as number) &&
        ((property.importantEnds || property.valueEnds) as number) <
          (property.semi as number)
      ) {
        console.log(
          `154 validateStyle() ${`\u001b[${31}m${`rogue gap in front of semi ${property.property}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId,
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

      // 5 colon is not colon
      // <style>.a{color/red;}</style>
      //                ^

      if (property.colon && context.str[property.colon] !== ":") {
        console.log(
          `179 validateStyle() ${`\u001b[${31}m${`mis-typed colon ${property.property}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: `Mis-typed colon.`,
          fix: {
            ranges: [[property.colon, property.colon + 1, ":"]],
          },
        });
      }

      // 6 repeated semicolon after a property
      // <style>.a{color: red;;}</style>
      //                      ^

      if (
        property.semi &&
        !property.propertyStarts &&
        !property.valueStarts &&
        !property.importantStarts
      ) {
        console.log(
          `203 validateStyle() ${`\u001b[${31}m${`rogue semicolon at ${property.semi}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: `Rogue semicolon.`,
          fix: {
            ranges: [[property.semi, property.semi + 1]],
          },
        });
      }

      // 7. catch extra whitespace after colon
      if (property.colon && property.valueStarts) {
        if (property.valueStarts > property.colon + 2) {
          console.log(
            `220 validateStyle() ${`\u001b[${31}m${`remove whitespace after ${property.colon}`}\u001b[${39}m`}`
          );
          context.report({
            ruleId,
            idxFrom: property.start,
            idxTo: property.end,
            message: `Remove whitespace.`,
            fix: {
              ranges: [[property.colon + 2, property.valueStarts]],
            },
          });
        }
        if (
          property.valueStarts > property.colon + 1 &&
          !context.str[property.colon + 1].trim() &&
          context.str[property.colon + 1] !== " "
        ) {
          context.report({
            ruleId,
            idxFrom: property.colon + 1,
            idxTo: property.valueStarts,
            message: `Replace whitespace.`,
            fix: {
              ranges: [[property.colon + 1, property.valueStarts, " "]],
            },
          });
        }
      }
    });
  }

  if (nodeArr && Array.isArray(nodeArr) && nodeArr.length) {
    for (let i = 0, len = nodeArr.length; i < len; i++) {
      console.log(
        `254 validateStyle() ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
          nodeArr[i],
          null,
          4
        )}`
      );

      // this loop iterates through everything, CSS properties and whitespace
      // tokens, so let's check the leading/trailing whitespace. Any non-whitespace
      // characters would be put into properties, so we could say text token
      // inside CSS style attribute or CSS rule is used exclusively for whitespace.

      if (
        // leading whitespace
        (!i ||
          // trailing whitespace
          i === len - 1) &&
        nodeArr[i].type === "text" &&
        ruleId === "attribute-validate-style"
      ) {
        console.log(
          `275 validateStyle() report [${nodeArr[i].start}, ${nodeArr[i].end}]`
        );
        // maybe whole value is whitespace?
        // <td style="  \t">
        //            ^^^^
        if (len === 1) {
          context.report({
            ruleId,
            idxFrom: nodeArr[i].start,
            idxTo: nodeArr[i].end,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          context.report({
            ruleId,
            idxFrom: nodeArr[i].start,
            idxTo: nodeArr[i].end,
            message: `Remove whitespace.`,
            fix: {
              ranges: [[nodeArr[i].start, nodeArr[i].end]],
            },
          });
        }
      }

      if (nodeArr[i].value === null) {
        // tend a rare case, a rogue semicolon:
        // <style>.a{color:red; !important;}</style>
        //                    ^
        if (
          (nodeArr[i] as Property).important !== null &&
          (nodeArr[i] as Property).property === null
        ) {
          console.log(
            `310 validateStyle() ${`\u001b[${31}m${`██`}\u001b[${39}m`} no value, no property`
          );

          let errorRaised = false;
          if (i) {
            for (let y = nodeArr.length; y--; ) {
              if (y === i) {
                console.log(`317 validateStyle() skip thyself`);
                continue;
              }
              console.log(
                `321 validateStyle() - property: ${JSON.stringify(
                  nodeArr[y],
                  null,
                  4
                )}`
              );
              if (
                // the property we're talking about is missing both
                // value and property, yet it contains !important
                (nodeArr[i] as Property).important &&
                !(nodeArr[i] as Property).propertyStarts &&
                !(nodeArr[i] as Property).valueStarts &&
                // we're traversing upon a CSS property, not a whitespace text token
                (nodeArr[y] as any).property !== undefined
              ) {
                console.log(`336 validateStyle()`);
                if (
                  // its semi is present
                  (nodeArr[y] as any).semi &&
                  // and its important is missing
                  !(nodeArr[y] as any).importantStarts
                ) {
                  console.log(`343 validateStyle()`);
                  // the frontal space might be missing
                  const fromIdx = (nodeArr[y] as any).semi;
                  const toIdx = (nodeArr[y] as any).semi + 1;
                  let whatToInsert;
                  if (context.str[(nodeArr[y] as any).semi + 1] !== " ") {
                    whatToInsert = " ";
                  }

                  console.log(
                    `353 validateStyle() report [${fromIdx}, ${toIdx}]`
                  );
                  context.report({
                    ruleId,
                    idxFrom: fromIdx,
                    idxTo: toIdx,
                    message: `Delete the semicolon.`,
                    fix: {
                      ranges: [[fromIdx, toIdx, whatToInsert]],
                    },
                  });

                  errorRaised = true;
                  console.log(
                    `367 validateStyle() ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`errorRaised`}\u001b[${39}m`} = ${JSON.stringify(
                      errorRaised,
                      null,
                      4
                    )}`
                  );
                } else {
                  // stop looping further
                  console.log(
                    `376 validateStyle() ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
                  );
                  break;
                }
              }
            }
          }

          // catch css properties without values
          // <style>.a{color:}</style>
          //                ^

          if (
            // it's a property token, not text whitespace token:
            (nodeArr[i] as Property).property !== undefined &&
            // and error hasn't been raised so far:
            !errorRaised
          ) {
            console.log(`394 validateStyle() report missing value`);
            context.report({
              ruleId,
              idxFrom: nodeArr[i].start,
              idxTo: nodeArr[i].end,
              message: `Missing value.`,
              fix: null,
            });
          }
        } else if (
          // avoid cases of semi-only tokens
          (nodeArr[i] as Property).property ||
          (nodeArr[i] as Property).value ||
          (nodeArr[i] as Property).important
        ) {
          console.log(
            `410 validateStyle() ${`\u001b[${31}m${`██`}\u001b[${39}m`} simply no value`
          );
          context.report({
            ruleId,
            idxFrom: nodeArr[i].start,
            idxTo: nodeArr[i].end,
            message: `Missing value.`,
            fix: null,
          });
        }
      }
    }
  }
}

export default validateStyle;
