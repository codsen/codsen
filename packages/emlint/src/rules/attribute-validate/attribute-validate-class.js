// rule: attribute-validate-class
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";
import { classNameRegex } from "../../util/constants";

function attributeValidateClass(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateClass() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateClass(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "class") {
        // validate the parent
        if (
          [
            "base",
            "basefont",
            "head",
            "html",
            "meta",
            "param",
            "script",
            "style",
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartAt
          );
          console.log(
            `052 \n${`\u001b[${33}m${`node.attribValueStartAt + charStart`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueStartAt + charStart,
              null,
              4
            )}; \n${`\u001b[${33}m${`node.attribValueStartAt + charEnd`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueStartAt + charEnd,
              null,
              4
            )}; \n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          console.log(
            `068 ${`\u001b[${36}m${`traverse and extract classes`}\u001b[${39}m`}`
          );
          let classStartsAt = null;
          let classEndsAt = null;
          for (
            let i = node.attribValueStartAt + charStart;
            i < node.attribValueStartAt + charEnd;
            i++
          ) {
            console.log(
              `078 ${`\u001b[${36}m${`------------------------------------------------\ncontext.str[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
                context.str[i],
                null,
                4
              )}`
            );

            // catch the beginning of a class name
            if (classStartsAt === null && context.str[i].trim().length) {
              classStartsAt = i;
              console.log(
                `089 SET ${`\u001b[${33}m${`classStartsAt`}\u001b[${39}m`} = ${classStartsAt}`
              );

              if (
                classEndsAt !== null &&
                context.str.slice(classEndsAt, i) !== " "
              ) {
                console.log(
                  `097 problems with whitespace, carved out ${JSON.stringify(
                    context.str.slice(classEndsAt, i),
                    null,
                    4
                  )}`
                );
                // remove the minimal amount of content - if spaces are there
                // already, leave them
                let ranges;
                if (context.str[classEndsAt] === " ") {
                  ranges = [[classEndsAt + 1, i]];
                  console.log(
                    `109 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                      ranges,
                      null,
                      4
                    )}`
                  );
                } else if (context.str[i - 1] === " ") {
                  ranges = [[classEndsAt, i - 1]];
                  console.log(
                    `118 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                      ranges,
                      null,
                      4
                    )}`
                  );
                } else {
                  console.log(
                    `126 worst case scenario, replace the whole whitespace`
                  );
                  ranges = [[classEndsAt, i, " "]];
                  console.log(
                    `130 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                      ranges,
                      null,
                      4
                    )}`
                  );
                }

                // raise an error about this excessive/wrong whitespace
                errorArr.push({
                  idxFrom: classEndsAt,
                  idxTo: i,
                  message: `Should be a single space.`,
                  fix: {
                    ranges: [[classEndsAt, i, " "]]
                  }
                });

                // only now reset
                classEndsAt = null;
              }
            }

            // catch the ending of a class name
            if (
              classStartsAt !== null &&
              (!context.str[i].trim().length ||
                i + 1 === node.attribValueStartAt + charEnd)
            ) {
              classEndsAt =
                i + 1 === node.attribValueStartAt + charEnd ? i + 1 : i;
              console.log(
                `162 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`classEndsAt`}\u001b[${39}m`} = ${classEndsAt}`
              );
              console.log(
                `165 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`carved out a class name`}\u001b[${39}m`} ${JSON.stringify(
                  context.str.slice(
                    classStartsAt,
                    i + 1 === node.attribValueStartAt + charEnd ? i + 1 : i
                  ),
                  null,
                  0
                )}`
              );

              // evaluate
              console.log(`176 ███████████████████████████████████████`);
              console.log(
                `R1 = "${classNameRegex.test(
                  context.str.slice(
                    classStartsAt,
                    i + 1 === node.attribValueStartAt + charEnd ? i + 1 : i
                  )
                )}"`
              );
              if (
                !classNameRegex.test(
                  context.str.slice(
                    classStartsAt,
                    i + 1 === node.attribValueStartAt + charEnd ? i + 1 : i
                  )
                )
              ) {
                console.log(
                  `194 PUSH ${JSON.stringify(
                    {
                      idxFrom: classStartsAt,
                      idxTo:
                        i + 1 === node.attribValueStartAt + charEnd ? i + 1 : i,
                      message: `Wrong class name.`,
                      fix: null
                    },
                    null,
                    4
                  )}`
                );
                errorArr.push({
                  idxFrom: classStartsAt,
                  idxTo:
                    i + 1 === node.attribValueStartAt + charEnd ? i + 1 : i,
                  message: `Wrong class name.`,
                  fix: null
                });
              }

              // reset
              classStartsAt = null;
              console.log(
                `218 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`classStartsAt`}\u001b[${39}m`} = ${classStartsAt}`
              );
            }

            console.log(" ");
            console.log(" ");
            console.log(
              `${`\u001b[${90}m${`██ classStartsAt = ${classStartsAt}; classEndsAt = ${classEndsAt}`}\u001b[${39}m`}`
            );
            console.log(" ");
            console.log(" ");
          }

          console.log(
            `232 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`240 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-class"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateClass;
