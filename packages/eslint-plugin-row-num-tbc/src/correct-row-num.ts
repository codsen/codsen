import { fixRowNums } from "js-row-num";
// import { stringify } from "./util";

declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}

const create = (context: Obj): Obj => {
  DEV &&
    console.log(
      `013 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
    );

  return {
    CallExpression(node: Obj) {
      // console.log(stringify(node, null, 4));
      DEV && console.log(`019 node.callee.type = ${node.callee.type}`);

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
        DEV && console.log(`035 ██ `);
        node.arguments.forEach((arg) => {
          // console.log(
          //   `033 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${stringify(
          //     arg,
          //     null,
          //     4
          //   )}`
          // );

          // if the updated console.log contents are different from what we
          // have now, latter needs to be updated.
          if (
            arg.type === "Literal" &&
            typeof arg.raw === "string" &&
            arg.raw !==
              fixRowNums(arg.raw, {
                overrideRowNum: arg.loc.start.line,
                extractedLogContentsWereGiven: true,
              }).result
          ) {
            DEV &&
              console.log(
                `058 ${`\u001b[${32}m${`we have console.log with single or double quotes`}\u001b[${39}m`}`
              );
            context.report({
              node,
              messageId: "correctRowNum",
              fix: (fixerObj: Obj) => {
                let { ranges } = fixRowNums(arg.raw, {
                  overrideRowNum: arg.loc.start.line,
                  extractedLogContentsWereGiven: true,
                });
                DEV &&
                  console.log(
                    `070 ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                      ranges,
                      null,
                      4
                    )}`
                  );
                DEV &&
                  console.log(
                    `078 ${`\u001b[${33}m${`arg.start`}\u001b[${39}m`} = ${JSON.stringify(
                      arg.start,
                      null,
                      4
                    )} (type ${typeof arg.start})`
                  );
                if (Array.isArray(ranges) && ranges.length) {
                  let offset: number = arg.start as number;
                  if (
                    !offset &&
                    arg.range &&
                    typeof arg.range[0] === "number"
                  ) {
                    offset = arg.range[0];
                  }

                  let preppedRanges = [
                    offset + ranges[0][0],
                    offset + ranges[0][1],
                  ];
                  DEV &&
                    console.log(
                      `100 ${`\u001b[${33}m${`preppedRanges`}\u001b[${39}m`} = ${JSON.stringify(
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

                extractedLogContentsWereGiven: true,
              }).result
          ) {
            DEV &&
              console.log(
                `126 ${`\u001b[${32}m${`we have console.log with backticks`}\u001b[${39}m`}`
              );
            context.report({
              node,
              messageId: "correctRowNum",
              fix: (fixerObj: Obj) => {
                let { ranges } = fixRowNums(arg.quasis[0].value.raw, {
                  overrideRowNum: arg.loc.start.line,
                  extractedLogContentsWereGiven: true,
                });
                DEV &&
                  console.log(
                    `138 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                      ranges,
                      null,
                      4
                    )}`
                  );
                if (ranges) {
                  let offset = (arg.quasis[0].range[0] as number) + 1;
                  DEV &&
                    console.log(
                      `148 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`offset`}\u001b[${39}m`} = ${JSON.stringify(
                        offset,
                        null,
                        4
                      )}`
                    );
                  if (
                    !offset &&
                    arg.range &&
                    typeof arg.range[0] === "number"
                  ) {
                    offset = (arg.quasis[0].start as number) + 1; // compensate plus one for the back-tick
                    DEV &&
                      console.log(
                        `162 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`offset`}\u001b[${39}m`} = ${JSON.stringify(
                          offset,
                          null,
                          4
                        )}`
                      );
                  }

                  let preppedRanges = [
                    offset + ranges[0][0],
                    offset + ranges[0][1],
                  ];
                  DEV &&
                    console.log(
                      `176 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedRanges`}\u001b[${39}m`} = ${JSON.stringify(
                        preppedRanges,
                        null,
                        4
                      )}`
                    );

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

export const correctRowNum = {
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
