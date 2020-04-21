// rule: attribute-duplicate
// -----------------------------------------------------------------------------

import { left } from "string-left-right";
import splitByWhitespace from "../../util/splitByWhitespace";

// it flags up duplicate HTML attributes

function attributeDuplicate(context, ...opts) {
  const attributesWhichCanBeMerged = ["id", "class"];

  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ attributeDuplicate() ███████████████████████████████████████`
      );
      console.log(
        `018 attributeDuplicate(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `025 attributeDuplicate(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if there is more than 1 attribute
      if (Array.isArray(node.attribs) && node.attribs.length > 1) {
        const attrsGatheredSoFar = []; // record unique names
        const mergeableAttrsCaught = []; // also unique

        for (let i = 0, len = node.attribs.length; i < len; i++) {
          console.log(
            `035 attributeDuplicate(): ${`\u001b[${33}m${`node.attribs[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribs[i],
              null,
              4
            )}`
          );
          if (!attrsGatheredSoFar.includes(node.attribs[i].attribName)) {
            attrsGatheredSoFar.push(node.attribs[i].attribName);
            console.log(
              `044 attributeDuplicate(): attrsGatheredSoFar = ${JSON.stringify(
                attrsGatheredSoFar,
                null,
                4
              )}`
            );
          } else if (
            !attributesWhichCanBeMerged.includes(node.attribs[i].attribName)
          ) {
            console.log(
              `054 attributeDuplicate(): RAISE ERROR FOR "${node.attribs[i].attribName}"`
            );
            context.report({
              ruleId: "attribute-duplicate",
              message: `Duplicate attribute "${node.attribs[i].attribName}".`,
              idxFrom: node.attribs[i].attribStart,
              idxTo: node.attribs[i].attribEnd,
              fix: null,
            });
          } else if (
            !mergeableAttrsCaught.includes(node.attribs[i].attribName)
          ) {
            // ^ ensure we don't push the same class/id twice

            mergeableAttrsCaught.push(node.attribs[i].attribName);
            console.log(
              `070 attributeDuplicate(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`mergeableAttrsCaught`}\u001b[${39}m`} now = ${JSON.stringify(
                mergeableAttrsCaught,
                null,
                4
              )}`
            );
          }
        }

        // process all recorded attributes which can be merged:
        if (mergeableAttrsCaught.length) {
          console.log(` `);
          console.log(` `);
          console.log(` `);
          console.log(`084      PROCESS EACH MERGEABLE ATTRIBUTE SEPARATELY`);
          console.log(` `);
          console.log(` `);
          console.log(` `);
          mergeableAttrsCaught.forEach((attrNameBeingMerged) => {
            console.log(` `);
            console.log(` ====== `);
            console.log(` `);
            console.log(
              `093 attributeDuplicate(): ${`\u001b[${32}m${`PROCESS`}\u001b[${39}m`} ${`\u001b[${33}m${`attrNameBeingMerged`}\u001b[${39}m`} = ${JSON.stringify(
                attrNameBeingMerged,
                null,
                4
              )}`
            );
            const theFirstRange = [];
            const extractedValues = [];
            const allOtherRanges = [];

            // can't use functional way with filter+reduce
            // instead we'll loop through all attributes

            for (let i = 0, len = node.attribs.length; i < len; i++) {
              if (node.attribs[i].attribName === attrNameBeingMerged) {
                console.log(
                  `109 attributeDuplicate(): ███ node.attribs[${i}] = ${JSON.stringify(
                    node.attribs[i],
                    null,
                    4
                  )}`
                );
                // make a note of the index ranges, separating the first
                // attribute occurence from the rest:
                if (!theFirstRange.length) {
                  // notice we push two values into an array
                  theFirstRange.push(
                    node.attribs[i].attribValueStartsAt,
                    node.attribs[i].attribValueEndsAt
                  );
                } else {
                  // notice we push an array into an array

                  // include whitespace to the left, unless it's the first
                  // attribute of a tag (i === 0, or falsey)
                  allOtherRanges.push([
                    i
                      ? left(context.str, node.attribs[i].attribStart) + 1
                      : node.attribs[i].attribStart,
                    node.attribs[i].attribEnd,
                  ]);
                }

                // either way, extract the values, split by whitespace
                splitByWhitespace(
                  node.attribs[i].attribValueRaw,
                  ([from, to]) => {
                    console.log(
                      `141 attributeDuplicate(): * incoming: ${`\u001b[${33}m${`[${from}, ${to}]`}\u001b[${39}m`} ("${node.attribs[
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

            console.log(
              `154 attributeDuplicate(): ${`\u001b[${35}m${`theFirstRange`}\u001b[${39}m`} = ${JSON.stringify(
                theFirstRange,
                null,
                4
              )}`
            );
            console.log(
              `161 attributeDuplicate(): ${`\u001b[${35}m${`extractedValues`}\u001b[${39}m`} = ${JSON.stringify(
                extractedValues,
                null,
                4
              )}`
            );
            console.log(
              `168 attributeDuplicate(): ${`\u001b[${35}m${`allOtherRanges`}\u001b[${39}m`} = ${JSON.stringify(
                allOtherRanges,
                null,
                4
              )}`
            );

            const mergedValue = extractedValues.sort().join(" ");

            console.log(
              `178 attributeDuplicate(): ${`\u001b[${33}m${`mergedValue`}\u001b[${39}m`} = ${JSON.stringify(
                mergedValue,
                null,
                4
              )}`
            );
            console.log(
              `185 attributeDuplicate(): ${`\u001b[${33}m${`theFirstRange`}\u001b[${39}m`} = ${JSON.stringify(
                theFirstRange,
                null,
                4
              )}`
            );
            console.log(
              `192 attributeDuplicate(): ${`\u001b[${33}m${`allOtherRanges`}\u001b[${39}m`} = ${JSON.stringify(
                allOtherRanges,
                null,
                4
              )}`
            );

            // finally, raise the error:
            console.log(
              `201 attributeDuplicate(): RAISE ERROR FOR "${attrNameBeingMerged}"`
            );
            console.log(
              `204 attributeDuplicate(): REPORT RANGES: ${JSON.stringify(
                [[...theFirstRange, mergedValue], ...allOtherRanges],
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
                ranges: [[...theFirstRange, mergedValue], ...allOtherRanges],
              },
            });
          });

          console.log(` `);
          console.log(` ====== `);
          console.log(` `);
        }
      }
    },
  };
}

export default attributeDuplicate;
