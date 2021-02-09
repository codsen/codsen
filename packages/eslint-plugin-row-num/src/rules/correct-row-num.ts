import stringify from "json-stringify-safe";
import { fixRowNums } from "js-row-num";
console.log(`003 ███████████████████████████████████████`);

export interface Obj {
  [key: string]: any;
}

const create = (context: Obj): Obj => {
  console.log(
    `011 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
  );
  return {
    CallExpression(node: Obj) {
      console.log(stringify(node, null, 4));
      console.log(`016 node.callee.type = ${node.callee.type}`);

      /* istanbul ignore else */
      if (
        node.callee &&
        node.callee.type === "MemberExpression" &&
        node.callee.object &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name === "console" &&
        node.callee.property &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "log" &&
        node.arguments &&
        Array.isArray(node.arguments) &&
        node.arguments.length
      ) {
        console.log(`032 ██ `);
        node.arguments.forEach((arg) => {
          console.log(`034 arg.raw: ${arg.raw}`);
          console.log(
            `036 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${stringify(
              arg,
              null,
              4
            )}`
          );

          // if the updated console.log contents are different from what we
          // have now, latter needs to be updated.
          if (
            arg.type === "Literal" &&
            typeof arg.raw === "string" &&
            arg.raw !==
              fixRowNums(arg.raw, {
                overrideRowNum: arg.loc.start.line,
                returnRangesOnly: false,
                extractedLogContentsWereGiven: true,
              })
          ) {
            console.log(
              `056 ${`\u001b[${32}m${`we have console.log with single or double quotes`}\u001b[${39}m`}`
            );
            context.report({
              node,
              messageId: "correctRowNum",
              fix: (fixerObj: Obj) => {
                const ranges = fixRowNums(arg.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true, // <------ now we request ranges
                  extractedLogContentsWereGiven: true,
                });
                console.log(
                  `066 ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                    ranges,
                    null,
                    4
                  )}`
                );
                console.log(
                  `073 ${`\u001b[${33}m${`arg.start`}\u001b[${39}m`} = ${JSON.stringify(
                    arg.start,
                    null,
                    4
                  )} (type ${typeof arg.start})`
                );
                if (ranges) {
                  let offset = arg.start;
                  if (
                    !offset &&
                    arg.range &&
                    typeof arg.range[0] === "number"
                  ) {
                    offset = arg.range[0];
                  }

                  const preppedRanges = [
                    offset + ranges[0][0],
                    offset + ranges[0][1],
                  ];
                  console.log(
                    `087 ${`\u001b[${33}m${`preppedRanges`}\u001b[${39}m`} = ${JSON.stringify(
                      preppedRanges,
                      null,
                      4
                    )}`
                  );
                  return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
                }
              },
            });
          } else if (
            arg.type === "TemplateLiteral" &&
            Array.isArray(arg.quasis) &&
            arg.quasis.length &&
            typeof arg.quasis[0] === "object" &&
            arg.quasis[0].value &&
            arg.quasis[0].value.raw &&
            arg.quasis[0].value.raw !==
              fixRowNums(arg.quasis[0].value.raw, {
                overrideRowNum: arg.loc.start.line,
                returnRangesOnly: false,
                extractedLogContentsWereGiven: true,
              })
          ) {
            console.log(
              `112 ${`\u001b[${32}m${`we have console.log with backticks`}\u001b[${39}m`}`
            );
            console.log(`R1: ${arg.quasis[0].value.raw}`);
            console.log(
              `R2: ${fixRowNums(arg.quasis[0].value.raw, {
                overrideRowNum: arg.loc.start.line,
                returnRangesOnly: true,
                extractedLogContentsWereGiven: true,
              })}`
            );
            context.report({
              node,
              messageId: "correctRowNum",
              fix: (fixerObj: Obj) => {
                const ranges = fixRowNums(arg.quasis[0].value.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true, // <------ now we request ranges
                  extractedLogContentsWereGiven: true,
                });
                if (ranges) {
                  const preppedRanges = [
                    arg.start + 1 + ranges[0][0],
                    arg.start + 1 + ranges[0][1],
                  ];
                  return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
                }
              },
            });
          }
        });
      }
    },
  };
};

export default {
  create,
  meta: {
    // docs: {
    //   url: getDocumentationUrl(__filename),
    // },
    type: "suggestion",
    messages: {
      correctRowNum: "Update the row number.",
    },
    fixable: "code", // or "code" or "whitespace"
  },
};
