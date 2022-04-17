import { rMerge } from "ranges-merge";
import { right } from "string-left-right";
import type { Range } from "../../../../../ops/typedefs/common";

import { Linter, RuleObjType } from "../../linter";

// rule: attribute-duplicate
// -----------------------------------------------------------------------------

import splitByWhitespace from "../../util/splitByWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// it flags up duplicate HTML attributes

interface AttributeDuplicate {
  (context: Linter): RuleObjType;
}
const attributeDuplicate: AttributeDuplicate = (context) => {
  let attributesWhichCanBeMerged = new Set(["id", "class"]);

  // imagine string:
  // `<a class="" class=""  >`
  // this rule will remove both classes, ending with:
  // [[2, 20]]
  // now these ranges don't include the trailing two spaces
  // when applied, yielding:
  // `<a  >` instead of `<a>`.
  // We need to extend the ending of the last range if it's on a
  // whitespace, leading up to / or >.

  function prepLast(ranges: Range[]): Range[] {
    if (!Array.isArray(ranges) || !ranges.length) {
      return ranges;
    }
    if (!context.str[ranges[ranges.length - 1][1]].trim()) {
      DEV &&
        console.log(
          `040 attributeDuplicate(): ${`\u001b[${32}m${`EXTEND`}\u001b[${39}m`} the last range ${JSON.stringify(
            ranges[ranges.length - 1],
            null,
            4
          )}`
        );

      let charOnTheRightIdx = right(context.str, ranges[ranges.length - 1][1]);
      DEV &&
        console.log(
          `050 SET ${`\u001b[${33}m${`charOnTheRightIdx`}\u001b[${39}m`} = ${JSON.stringify(
            charOnTheRightIdx,
            null,
            4
          )}`
        );

      if (`/>`.includes(context.str[charOnTheRightIdx as number])) {
        DEV && console.log(`058 tag end reached - extend`);
        ranges[ranges.length - 1][1] = charOnTheRightIdx as number;
      }
    }
    return ranges;
  }

  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeDuplicate() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `073 attributeDuplicate(): node = ${JSON.stringify(node, null, 4)}`
        );

      // if there is more than 1 attribute
      if (Array.isArray(node.attribs) && node.attribs.length > 1) {
        let attrsGatheredSoFar = new Set(); // record unique names
        let mergeableAttrsCaught = new Set(); // also unique

        for (let i = 0, len = node.attribs.length; i < len; i++) {
          DEV &&
            console.log(
              `084 attributeDuplicate(): ${`\u001b[${33}m${`node.attribs[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
                node.attribs[i],
                null,
                4
              )}`
            );
          if (node.attribs[i].attribName === undefined) {
            DEV &&
              console.log(
                `093 attributeDuplicate(): skip ${node.attribs[i]} because it's not an attribute`
              );
            continue;
          }
          if (!attrsGatheredSoFar.has(node.attribs[i].attribName)) {
            attrsGatheredSoFar.add(node.attribs[i].attribName);
            DEV &&
              console.log(
                `101 attributeDuplicate(): attrsGatheredSoFar = ${JSON.stringify(
                  [...attrsGatheredSoFar],
                  null,
                  4
                )}`
              );
          } else if (
            !attributesWhichCanBeMerged.has(node.attribs[i].attribName) ||
            (Array.isArray(node.attribs[i].attribValue) &&
              node.attribs[i].attribValue.length &&
              node.attribs[i].attribValue.some(
                (obj) =>
                  typeof obj.value === "string" &&
                  (obj.value.includes(`'`) || obj.value.includes(`"`))
              ))
          ) {
            DEV &&
              console.log(
                `119 attributeDuplicate(): RAISE ERROR FOR "${node.attribs[i].attribName}"`
              );
            context.report({
              ruleId: "attribute-duplicate",
              message: `Duplicate attribute "${node.attribs[i].attribName}".`,
              idxFrom: node.attribs[i].attribStarts,
              idxTo: node.attribs[i].attribEnds,
              fix: null,
            });
          } else {
            mergeableAttrsCaught.add(node.attribs[i].attribName);
            DEV &&
              console.log(
                `132 attributeDuplicate(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`mergeableAttrsCaught`}\u001b[${39}m`} now = ${JSON.stringify(
                  mergeableAttrsCaught,
                  null,
                  4
                )}`
              );
          }
        }

        // process all recorded attributes which can be merged:
        if (mergeableAttrsCaught?.size) {
          DEV && console.log(` `);
          DEV && console.log(` `);
          DEV && console.log(` `);
          DEV &&
            console.log(`147      PROCESS EACH MERGEABLE ATTRIBUTE SEPARATELY`);
          DEV && console.log(` `);
          DEV && console.log(` `);
          DEV && console.log(` `);
          [...mergeableAttrsCaught].forEach((attrNameBeingMerged) => {
            DEV && console.log(` `);
            DEV && console.log(` ====== `);
            DEV && console.log(` `);
            DEV &&
              console.log(
                `157 attributeDuplicate(): ${`\u001b[${32}m${`PROCESS`}\u001b[${39}m`} ${`\u001b[${33}m${`attrNameBeingMerged`}\u001b[${39}m`} = ${JSON.stringify(
                  attrNameBeingMerged,
                  null,
                  4
                )}`
              );

            // the first attribute with its value will also be replaced,
            // in whole, except, its value will be merged string of all
            // extracted values of all same-name attributes
            let theFirstRange: [number, number] = [] as any;

            let extractedValues: string[] = [];
            let allOtherRanges: [number, number][] = [];

            // can't use functional way with filter+reduce
            // instead we'll loop through all attributes

            for (let i = 0, len = node.attribs.length; i < len; i++) {
              if (node.attribs[i].attribName === attrNameBeingMerged) {
                DEV &&
                  console.log(
                    `179 attributeDuplicate(): ███ node.attribs[${i}] = ${JSON.stringify(
                      node.attribs[i],
                      null,
                      4
                    )}`
                  );
                // make a note of the index ranges, separating the first
                // attribute occurence from the rest:
                if (!theFirstRange.length) {
                  // whole attributes goes too, including whitespace
                  // on the left - it's because we automaticaly tackle
                  // all dirty code cases, imagine a tab as whitespace
                  // character in front of class="..." or equal missing
                  // or similar issues with the first attribute
                  theFirstRange.push(
                    node.attribs[i].attribLeft + 1,
                    node.attribs[i].attribEnds
                  );
                } else {
                  // notice we push an array into an array

                  // include whitespace to the left, unless it's the first
                  // attribute of a tag (i === 0, or falsey)
                  allOtherRanges.push([
                    i
                      ? node.attribs[i].attribLeft + 1
                      : node.attribs[i].attribStarts,
                    node.attribs[i].attribEnds,
                  ]);
                }

                DEV && console.log(`210 attributeDuplicate(): check value`);
                if (node.attribs[i].attribValueStartsAt) {
                  DEV &&
                    console.log(
                      `214 attributeDuplicate(): split by whitespace`
                    );
                  // either way, extract the values, split by whitespace
                  splitByWhitespace(
                    node.attribs[i].attribValueRaw,
                    ([from, to]) => {
                      DEV &&
                        console.log(
                          `222 attributeDuplicate(): * incoming: ${`\u001b[${33}m${`[${from}, ${to}]`}\u001b[${39}m`} ("${node.attribs[
                            i
                          ].attribValueRaw.slice(from, to)}")`
                        );
                      extractedValues.push(
                        node.attribs[i].attribValueRaw.slice(from, to)
                      );
                    }
                  );
                }
              }
            }

            DEV &&
              console.log(
                `237 attributeDuplicate(): ${`\u001b[${35}m${`theFirstRange`}\u001b[${39}m`} = ${JSON.stringify(
                  theFirstRange,
                  null,
                  4
                )}`
              );
            DEV &&
              console.log(
                `245 attributeDuplicate(): ${`\u001b[${35}m${`extractedValues`}\u001b[${39}m`} = ${JSON.stringify(
                  extractedValues,
                  null,
                  4
                )}`
              );
            DEV &&
              console.log(
                `253 attributeDuplicate(): ${`\u001b[${35}m${`allOtherRanges`}\u001b[${39}m`} = ${JSON.stringify(
                  allOtherRanges,
                  null,
                  4
                )}`
              );

            let mergedValue = extractedValues.sort().join(" ");

            DEV &&
              console.log(
                `264 attributeDuplicate(): ${`\u001b[${33}m${`mergedValue`}\u001b[${39}m`} = ${JSON.stringify(
                  mergedValue,
                  null,
                  4
                )}`
              );
            DEV &&
              console.log(
                `272 attributeDuplicate(): ${`\u001b[${33}m${`theFirstRange`}\u001b[${39}m`} = ${JSON.stringify(
                  theFirstRange,
                  null,
                  4
                )}`
              );
            DEV &&
              console.log(
                `280 attributeDuplicate(): ${`\u001b[${33}m${`allOtherRanges`}\u001b[${39}m`} = ${JSON.stringify(
                  allOtherRanges,
                  null,
                  4
                )}`
              );

            // finally, raise the error:
            DEV &&
              console.log(
                `290 attributeDuplicate(): RAISE ERROR FOR "${attrNameBeingMerged}"`
              );
            DEV &&
              console.log(
                `294 attributeDuplicate(): REPORT RANGES: ${JSON.stringify(
                  [[...theFirstRange, mergedValue], ...allOtherRanges],
                  null,
                  4
                )}`
              );
            if (mergedValue?.length) {
              DEV &&
                console.log(
                  `303 attributeDuplicate(): merged value will be used`
                );

              let ranges = prepLast(
                rMerge([
                  [
                    ...theFirstRange,
                    ` ${attrNameBeingMerged}="${mergedValue}"`,
                  ],
                  ...allOtherRanges,
                ]) as Range[]
              );
              DEV &&
                console.log(
                  `317 attributeDuplicate(): ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                    ranges,
                    null,
                    4
                  )}`
                );

              context.report({
                ruleId: "attribute-duplicate",
                message: `Duplicate attribute "${attrNameBeingMerged}".`,
                idxFrom: node.start,
                idxTo: node.end,
                fix: {
                  ranges,
                },
              });
            } else {
              DEV && console.log(`334 attributeDuplicate(): no value to use!`);
              // remove all attributes of this kind

              let ranges = prepLast(
                rMerge([[...theFirstRange], ...allOtherRanges]) as Range[]
              );
              DEV &&
                console.log(
                  `342 attributeDuplicate(): ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                    ranges,
                    null,
                    4
                  )}`
                );

              context.report({
                ruleId: "attribute-duplicate",
                message: `Duplicate attribute "${attrNameBeingMerged}".`,
                idxFrom: node.start,
                idxTo: node.end,
                fix: {
                  ranges,
                },
              });
            }
          });

          DEV && console.log(` `);
          DEV && console.log(` ====== `);
          DEV && console.log(` `);
        }
      }
    },
  };
};

export default attributeDuplicate;
