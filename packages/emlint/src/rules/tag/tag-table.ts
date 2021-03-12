import { TagTokenWithChildren } from "packages/codsen-parser/types";
import { Linter, RuleObjType } from "../../linter";

// rule: tag-table
// checks the sanity in table structures
// -----------------------------------------------------------------------------

// it flags up any <bold> tags

function tagTable(context: Linter): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagTable() ███████████████████████████████████████`
      );

      if (node.tagName === "table" && !node.closing) {
        console.log(`018 table`);
        console.log(
          `020 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

        if (node.children && node.children.length) {
          // 1. catch colspan/rowspan issues
          // count how many td's each TR has, bail early if anything's wrong, such as
          // there are other tags than TR within TABLE children array and so on -
          // let other rules tackle it

          interface Finding {
            orderNumber: number; // zero-based index
            idx: number; // index of the TR within TABLE children arr.
            tds: number[]; // indexes of opening TD's within this TR children arr.
          }
          const extracted: Finding[] = [];
          let orderNumber = 0;

          // flag to check the correct sequence of opening and closing tags
          let closingTrMet = true;

          for (let i = 0, len1 = node.children.length; i < len1; i++) {
            console.log(`045 ${`\u001b[${36}m${`=`.repeat(80)}\u001b[${39}m`}`);

            if (
              node.children[i].type === "tag" &&
              (node.children[i] as TagTokenWithChildren).tagName === "tr"
            ) {
              console.log(
                `052 ${`\u001b[${36}m${`${node.children[i].value} - [${node.children[i].start}, ${node.children[i].end}]`}\u001b[${39}m`} - starting closingTrMet: ${closingTrMet}`
              );
              console.log(`054 ${`\u001b[${35}m${`TR`}\u001b[${39}m`}`);
              // if it's a closing TR, flip the flag
              if ((node.children[i] as TagTokenWithChildren).closing) {
                console.log(`057 a closing TR`);
                if (!closingTrMet) {
                  closingTrMet = true;
                  console.log(
                    `061 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTrMet`}\u001b[${39}m`} = ${JSON.stringify(
                      closingTrMet,
                      null,
                      4
                    )}`
                  );
                } else {
                  console.log(
                    `069 ${`\u001b[${31}m${`BAIL - closing TR without an opening - EXIT`}\u001b[${39}m`}`
                  );
                  return;
                }
              } else {
                console.log(`074 an opening TR`);
                if (closingTrMet) {
                  closingTrMet = false;
                  console.log(
                    `078 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTrMet`}\u001b[${39}m`} = ${JSON.stringify(
                      closingTrMet,
                      null,
                      4
                    )}`
                  );
                } else {
                  console.log(
                    `086 ${`\u001b[${31}m${`BAIL - an opening TR without an closing - EXIT`}\u001b[${39}m`}`
                  );
                  return;
                }

                console.log(
                  `092 ${`\u001b[${33}m${`node.children[i].value`}\u001b[${39}m`} = ${JSON.stringify(
                    node.children[i].value,
                    null,
                    4
                  )}`
                );
                const finding: Finding = {
                  orderNumber,
                  idx: i,
                  tds: [],
                };
                orderNumber++;
                // extract all TD's from within
                if (
                  (node.children[i] as TagTokenWithChildren).children &&
                  (node.children[i] as TagTokenWithChildren).children.length
                ) {
                  console.log(`109 TR with children`);

                  let closingTdMet = true;

                  for (
                    let y = 0,
                      len2 = (node.children[i] as TagTokenWithChildren).children
                        .length;
                    y < len2;
                    y++
                  ) {
                    console.log(
                      `121 ${`\u001b[${34}m${`-`.repeat(80)}\u001b[${39}m`}`
                    );
                    console.log(
                      `124 ${`\u001b[${33}m${`node.children[i].children[y]`}\u001b[${39}m`} = ${JSON.stringify(
                        (node.children[i] as TagTokenWithChildren).children[y]
                          .value,
                        null,
                        4
                      )}`
                    );
                    if (
                      ((node.children[i] as TagTokenWithChildren).children[
                        y
                      ] as TagTokenWithChildren).type === "tag" &&
                      ((node.children[i] as TagTokenWithChildren).children[
                        y
                      ] as TagTokenWithChildren).tagName === "td"
                    ) {
                      console.log(`139 ${`\u001b[${35}m${`TD`}\u001b[${39}m`}`);

                      if (
                        ((node.children[i] as TagTokenWithChildren).children[
                          y
                        ] as TagTokenWithChildren).closing
                      ) {
                        console.log(`146 a closing TD`);
                        if (!closingTdMet) {
                          closingTdMet = true;
                          console.log(
                            `150 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTdMet`}\u001b[${39}m`} = ${JSON.stringify(
                              closingTdMet,
                              null,
                              4
                            )}`
                          );
                        } else {
                          console.log(
                            `158 ${`\u001b[${31}m${`BAIL - closing TD without an opening - EXIT`}\u001b[${39}m`}`
                          );
                          return;
                        }
                      } else {
                        console.log(`163 an opening TD`);

                        if (closingTdMet) {
                          closingTdMet = false;
                          console.log(
                            `168 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTdMet`}\u001b[${39}m`} = ${JSON.stringify(
                              closingTdMet,
                              null,
                              4
                            )}`
                          );
                        } else {
                          console.log(
                            `176 ${`\u001b[${31}m${`BAIL - an opening TD without an closing - EXIT`}\u001b[${39}m`}`
                          );
                          return;
                        }

                        console.log(`181 push`);
                        finding.tds.push(y);
                      }
                    }
                  }
                  console.log(
                    `187 ${`\u001b[${34}m${`-`.repeat(80)}\u001b[${39}m`} fin.`
                  );

                  if (!closingTdMet) {
                    console.log(
                      `192 ${`\u001b[${31}m${`BAIL - missing closing TD - EXIT`}\u001b[${39}m`}`
                    );
                    return;
                  }
                }
                console.log(`197 push`);
                extracted.push(finding);
              }

              console.log(
                `202 ${`\u001b[${36}m${`${node.children[i].value} - [${node.children[i].start}, ${node.children[i].end}]`}\u001b[${39}m`} - ending closingTrMet: ${closingTrMet}`
              );
            }
          }
          console.log(
            `207 ${`\u001b[${36}m${`=`.repeat(80)}\u001b[${39}m`} fin.`
          );

          // tags with let's say missing clashes will be nested further:
          // <table><tr><td><tr><td><td></table>
          // so the ending closingTrMet will be false, not true
          if (!closingTrMet) {
            console.log(
              `215 ${`\u001b[${31}m${`BAIL - missing closing TR - EXIT`}\u001b[${39}m`}`
            );
            return;
          }
          console.log(
            `220 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`extracted`}\u001b[${39}m`} = ${JSON.stringify(
              extracted,
              null,
              4
            )}`
          );

          if (extracted.length) {
            console.log(`228`);
            const spans = extracted.map((findingObj) =>
              findingObj.tds.reduce((acc, curr) => {
                let temp = 0;
                if (
                  // if there's colspan on this td, use that value
                  (node.children[findingObj.idx] as any).children[curr]
                    .attribs &&
                  (node.children[findingObj.idx] as any).children[curr].attribs
                    .length &&
                  ((node.children[findingObj.idx] as any).children[
                    curr
                  ] as TagTokenWithChildren).attribs.some(
                    (attrib) =>
                      attrib.attribName === "colspan" &&
                      attrib.attribValue &&
                      attrib.attribValue.length &&
                      attrib.attribValue.some((valObjNode) => {
                        if (
                          (valObjNode as any).type === "text" &&
                          Number.isInteger(+(valObjNode as any).value)
                        ) {
                          // drill through and also extract the value
                          temp = +(valObjNode as any).value;
                          return true;
                        }
                        return false;
                      })
                  )
                ) {
                  return acc + temp;
                }
                return acc + 1;
              }, 0)
            );
            console.log(
              `264 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spans`}\u001b[${39}m`} = ${JSON.stringify(
                spans,
                null,
                4
              )}`
            );
            const uniqueSpans = new Set(spans);
            // console.log(
            //   `268 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`uniqueSpans`}\u001b[${39}m`} = ${JSON.stringify(
            //     [...uniqueSpans],
            //     null,
            //     4
            //   )}`
            // );

            const tdCounts = extracted.map((e) => e.tds.length);
            console.log(
              `281 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tdCounts`}\u001b[${39}m`} = ${JSON.stringify(
                tdCounts,
                null,
                4
              )}`
            );

            // The "uniqueSpans" takes into account colspan attr values, if any - this is
            // the absolute measurement, if everything is all right. If it's not allright,
            // we start from the bottom, evaluating TD's and colspan attributes and then
            // finding out what's wrong
            if (uniqueSpans.size && uniqueSpans.size !== 1) {
              console.log(
                `294 ${`\u001b[${31}m${`COLSPAN ISSUE!`}\u001b[${39}m`}`
              );

              const tdMaxCountPerRow = Math.max(...tdCounts);
              console.log(
                `299 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tdMaxCountPerRow`}\u001b[${39}m`} = ${tdMaxCountPerRow}`
              );

              // 1. rows where there's lesser amount of TD's and possibly colspan is missing/wrong
              extracted
                // rows with lesser
                .filter((e) => e.tds.length !== tdMaxCountPerRow)
                .forEach((e) => {
                  console.log(
                    `308 ${`\u001b[${90}m${`~`.repeat(80)}\u001b[${39}m`}`
                  );
                  console.log(
                    `311 ${`\u001b[${33}m${`e`}\u001b[${39}m`} = ${JSON.stringify(
                      e,
                      null,
                      4
                    )}`
                  );

                  if (
                    e.tds.length === spans[e.orderNumber] &&
                    e.tds.length === 1
                  ) {
                    console.log(
                      `323 single column, a definite fix recipe, add a colspan`
                    );
                    // position to insert the attribute is to the left of tag token's end,
                    // provided it ends with bracket!
                    const pos =
                      (node.children[e.idx] as any).children[e.tds[0]].end - 1;
                    context.report({
                      ruleId: "tag-table",
                      message: `Add a collspan.`,
                      idxFrom: (node.children[e.idx] as any).children[e.tds[0]]
                        .start,
                      idxTo: (node.children[e.idx] as any).children[e.tds[0]]
                        .end,
                      fix: {
                        ranges: [[pos, pos, ` colspan="${tdMaxCountPerRow}"`]],
                      },
                    });
                  } else {
                    context.report({
                      ruleId: "tag-table",
                      message: `Should contain ${tdMaxCountPerRow} td's.`,
                      idxFrom: node.children[e.idx].start,
                      idxTo: node.children[e.idx].end,
                      fix: null,
                    });
                  }
                });
            }
          }
        }
      }
    },
  };
}

export default tagTable;
