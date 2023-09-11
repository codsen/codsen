import { TSESLint } from "@typescript-eslint/utils";
import { strIdx } from "line-column-mini";
// import stringify from "json-stringify-safe";
import op from "object-path";
import { parse } from "postcss";

declare let DEV: boolean;

type MessageIds = "parserMsg";
// type Options = [];

const parsesOk: TSESLint.RuleModule<MessageIds> = {
  defaultOptions: [],
  meta: {
    // docs: {
    //   url: getDocumentationUrl(__filename),
    // },
    type: "suggestion",
    messages: {
      parserMsg: "{{ identifier }}",
    },
    fixable: "code",
    schema: [],
  },
  create: (context) => {
    DEV && console.log(`\n`.repeat(20));
    DEV &&
      console.log(
        `029 correct-test-num.ts: ${`\u001b[${33}m${`████████████████████ create() start`}\u001b[${39}m`}`,
      );

    DEV &&
      console.log(
        `034 source code: ${JSON.stringify(
          context.sourceCode.getText(),
          null,
          4,
        )}`,
      );

    // DEV &&
    //   console.log(
    //     `${`\u001b[${33}m${`context`}\u001b[${39}m`} = ${stringify(context)}`
    //   );

    return {
      TaggedTemplateExpression(node) {
        DEV &&
          console.log(`049 ███████████████████████████████████████ here here`);
        /*DEV &&
          console.log(
            `043 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(
              node,
              null,
              4,
            )}`,
          );*/

        // check if the "callee" is "styled":
        // export const StyledComponent = styled(Table)`
        //                                ^^^^^^
        let calleeIdentifier = op.get(node, "tag.callee.name");
        DEV &&
          console.log(
            `065 ${`\u001b[${33}m${`calleeIdentifier`}\u001b[${39}m`} = ${JSON.stringify(
              calleeIdentifier,
              null,
              4,
            )}`,
          );

        if (calleeIdentifier === "styled") {
          DEV &&
            console.log(
              `075 ██ ${`\u001b[${35}m${`a styled caught!`}\u001b[${39}m`} at [${op.get(
                node,
                "tag.callee.range",
              )}]`,
            );

          let quasiType = op.get(node, "quasi.type");
          DEV &&
            console.log(
              `084 ${`\u001b[${33}m${`quasiType`}\u001b[${39}m`} = ${JSON.stringify(
                quasiType,
                null,
                4,
              )}`,
            );
          if (
            quasiType === "TemplateLiteral" &&
            op.has(node, "quasi.quasis.0") &&
            op.has(node, "quasi.quasis.0.range.0")
          ) {
            let styledTemplatingLiteralPosStartIdx = op.get(
              node,
              "quasi.quasis.0.range.0",
            );
            DEV &&
              console.log(
                `101 ${`\u001b[${31}m${`STYLED TEMPLATING LITERAL STARTS AT`}\u001b[${39}m`}: ${JSON.stringify(
                  styledTemplatingLiteralPosStartIdx,
                  null,
                  4,
                )}`,
              );
            let quasisValue = op.get(node, "quasi.quasis.0.value.raw");
            DEV &&
              console.log(
                `110 ${`\u001b[${33}m${`quasisValue`}\u001b[${39}m`} = ${JSON.stringify(
                  quasisValue,
                  null,
                  4,
                )}`,
              );

            let quasisLoc = op.get(node, "quasi.quasis.0.loc");
            DEV &&
              console.log(
                `120 SET ${`\u001b[${33}m${`quasisLoc`}\u001b[${39}m`} = ${JSON.stringify(
                  quasisLoc,
                  null,
                  4,
                )}`,
              );

            if (typeof quasisLoc?.start?.line !== "number") {
              console.log(`128 something strange; early exit`);
              return;
            }

            try {
              parse(quasisValue);
            } catch (error: any) {
              DEV &&
                console.log(
                  `137 ${`\u001b[${33}m${`error`}\u001b[${39}m`} = ${JSON.stringify(
                    error,
                    null,
                    4,
                  )}`,
                );

              // error reports only row and column, so we need to convert it back
              // to string index position
              let errorPosIdx = strIdx(error.source, error.line, error.column);
              DEV &&
                console.log(
                  `149 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`errorPosIdx`}\u001b[${39}m`} = ${JSON.stringify(
                    errorPosIdx,
                    null,
                    4,
                  )}`,
                );

              let finalPosIdx =
                styledTemplatingLiteralPosStartIdx + 1 + errorPosIdx;
              DEV &&
                console.log(
                  `160 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalPosIdx`}\u001b[${39}m`} = ${JSON.stringify(
                    finalPosIdx,
                    null,
                    4,
                  )}`,
                );

              let { line, column } =
                context.sourceCode.getLocFromIndex(finalPosIdx);
              DEV &&
                console.log(
                  `171 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${line};  ${`\u001b[${33}m${`column`}\u001b[${39}m`} = ${column}`,
                );

              context.report({
                messageId: "parserMsg",
                loc: {
                  start: {
                    line,
                    column,
                  },
                  end: {
                    line,
                    column: column + 1,
                  },
                },
                data: {
                  identifier: error.reason,
                },
              });
            }
          }
        }
      },
    };
  },
};

export { parsesOk };
