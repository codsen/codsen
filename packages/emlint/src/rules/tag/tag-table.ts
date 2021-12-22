import { TagTokenWithChildren } from "packages/codsen-parser/types";

import { Linter, RuleObjType } from "../../linter";
import { Attrib } from "../../util/commonTypes";

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
        console.log(`020 table`);
        console.log(
          `022 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

        if (node.children?.length) {
          // 1. catch colspan/rowspan issues
          // count how many td's each TR has, bail early if anything's wrong, such as
          // there are other tags than TR within TABLE children array and so on -
          // let other rules tackle it

          interface Finding {
            orderNumber: number; // zero-based index
            idx: number; // index of the TR within TABLE children arr.
            tds: number[]; // indexes of opening TD's within this TR children arr.
          }
          let extracted: Finding[] = [];
          let orderNumber = 0;

          // flag to check the correct sequence of opening and closing tags
          let closingTrMet = true;
          let trFound = false;
          let tdFound = false;

          for (let i = 0, len1 = node.children.length; i < len1; i++) {
            console.log(`049 ${`\u001b[${36}m${`=`.repeat(80)}\u001b[${39}m`}`);

            if (
              node.children[i].type === "tag" &&
              (node.children[i] as TagTokenWithChildren).tagName === "tr"
            ) {
              if (!trFound) {
                trFound = true;
              }
              console.log(
                `059 ${`\u001b[${36}m${`${node.children[i].value} - [${node.children[i].start}, ${node.children[i].end}]`}\u001b[${39}m`} - starting closingTrMet: ${closingTrMet}`
              );
              console.log(`061 ${`\u001b[${35}m${`TR`}\u001b[${39}m`}`);
              // if it's a closing TR, flip the flag
              if ((node.children[i] as TagTokenWithChildren).closing) {
                console.log(`064 a closing TR`);
                if (!closingTrMet) {
                  closingTrMet = true;
                  console.log(
                    `068 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTrMet`}\u001b[${39}m`} = ${JSON.stringify(
                      closingTrMet,
                      null,
                      4
                    )}`
                  );
                } else {
                  console.log(
                    `076 ${`\u001b[${31}m${`BAIL - closing TR without an opening - EXIT`}\u001b[${39}m`}`
                  );
                  return;
                }
              } else {
                console.log(`081 an opening TR`);
                if (closingTrMet) {
                  closingTrMet = false;
                  console.log(
                    `085 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTrMet`}\u001b[${39}m`} = ${JSON.stringify(
                      closingTrMet,
                      null,
                      4
                    )}`
                  );
                } else {
                  console.log(
                    `093 ${`\u001b[${31}m${`BAIL - an opening TR without an closing - EXIT`}\u001b[${39}m`}`
                  );
                  return;
                }

                console.log(
                  `099 ${`\u001b[${33}m${`node.children[i].value`}\u001b[${39}m`} = ${JSON.stringify(
                    node.children[i].value,
                    null,
                    4
                  )}`
                );
                let finding: Finding = {
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
                  console.log(`116 TR with children`);

                  let closingTdMet = true;

                  for (
                    let y = 0,
                      len2 = (node.children[i] as TagTokenWithChildren).children
                        .length;
                    y < len2;
                    y++
                  ) {
                    console.log(
                      `128 ${`\u001b[${34}m${`-`.repeat(80)}\u001b[${39}m`}`
                    );
                    console.log(
                      `131 ${`\u001b[${33}m${`node.children[i].children[y]`}\u001b[${39}m`} = ${JSON.stringify(
                        (node.children[i] as TagTokenWithChildren).children[y]
                          .value,
                        null,
                        4
                      )}`
                    );
                    if (
                      (
                        (node.children[i] as TagTokenWithChildren).children[
                          y
                        ] as TagTokenWithChildren
                      ).type === "tag" &&
                      (
                        (node.children[i] as TagTokenWithChildren).children[
                          y
                        ] as TagTokenWithChildren
                      ).tagName === "td"
                    ) {
                      console.log(`150 ${`\u001b[${35}m${`TD`}\u001b[${39}m`}`);
                      if (!tdFound) {
                        tdFound = true;
                      }

                      if (
                        (
                          (node.children[i] as TagTokenWithChildren).children[
                            y
                          ] as TagTokenWithChildren
                        ).closing
                      ) {
                        console.log(`162 a closing TD`);
                        if (!closingTdMet) {
                          closingTdMet = true;
                          console.log(
                            `166 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTdMet`}\u001b[${39}m`} = ${JSON.stringify(
                              closingTdMet,
                              null,
                              4
                            )}`
                          );
                        } else {
                          console.log(
                            `174 ${`\u001b[${31}m${`BAIL - closing TD without an opening - EXIT`}\u001b[${39}m`}`
                          );
                          return;
                        }
                      } else {
                        console.log(`179 an opening TD`);

                        if (closingTdMet) {
                          closingTdMet = false;
                          console.log(
                            `184 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingTdMet`}\u001b[${39}m`} = ${JSON.stringify(
                              closingTdMet,
                              null,
                              4
                            )}`
                          );
                        } else {
                          console.log(
                            `192 ${`\u001b[${31}m${`BAIL - an opening TD without an closing - EXIT`}\u001b[${39}m`}`
                          );
                          return;
                        }

                        console.log(`197 push`);
                        finding.tds.push(y);
                      }
                    }
                  }
                  console.log(
                    `203 ${`\u001b[${34}m${`-`.repeat(80)}\u001b[${39}m`} fin.`
                  );

                  if (!closingTdMet) {
                    console.log(
                      `208 ${`\u001b[${31}m${`BAIL - missing closing TD - EXIT`}\u001b[${39}m`}`
                    );
                    return;
                  }
                }
                console.log(`213 push`);
                extracted.push(finding);
              }

              console.log(
                `218 ${`\u001b[${36}m${`${node.children[i].value} - [${node.children[i].start}, ${node.children[i].end}]`}\u001b[${39}m`} - ending closingTrMet: ${closingTrMet}`
              );
            } else if (
              // if <table> child is a text token
              node.children[i].type === "text" &&
              // it's not just whitespace
              node.children[i].value.trim()
            ) {
              console.log(
                `227 ${`\u001b[${31}m${`rogue intra-tag characters!`}\u001b[${39}m`}`
              );
              context.report({
                ruleId: "tag-table",
                message: `Rogue character${
                  node.children[i].value.trim().length > 1 ? "s" : ""
                } between tags.`,
                idxFrom: node.children[i].start,
                idxTo: node.children[i].end,
                fix: null,
              });
            }
          }
          console.log(
            `241 ${`\u001b[${36}m${`=`.repeat(80)}\u001b[${39}m`} fin.`
          );

          if (!trFound) {
            console.log(`245 ${`\u001b[${32}m${`tr missing`}\u001b[${39}m`}`);
            context.report({
              ruleId: "tag-table",
              message: `Missing children <tr> tags.`,
              idxFrom: node.start,
              idxTo: node.end,
              fix: null,
            });
          } else if (!tdFound) {
            console.log(`254 ${`\u001b[${32}m${`td missing`}\u001b[${39}m`}`);
            context.report({
              ruleId: "tag-table",
              message: `Missing children <td> tags.`,
              idxFrom: node.start,
              idxTo: node.end,
              fix: null,
            });
          }

          // tags with let's say missing clashes will be nested further:
          // <table><tr><td><tr><td><td></table>
          // so the ending closingTrMet will be false, not true
          if (!closingTrMet) {
            console.log(
              `269 ${`\u001b[${31}m${`BAIL - missing closing TR - EXIT`}\u001b[${39}m`}`
            );
            return;
          }
          console.log(
            `274 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`extracted`}\u001b[${39}m`} = ${JSON.stringify(
              extracted,
              null,
              4
            )}`
          );

          if (extracted.length) {
            console.log(`282`);
            let bail = false;
            let spans = extracted.map((findingObj) =>
              findingObj.tds.reduce((acc, curr) => {
                let temp = 0;
                if (
                  // if there's colspan on this td, use that value
                  (node.children[findingObj.idx] as any).children[curr]
                    .attribs &&
                  (node.children[findingObj.idx] as any).children[curr].attribs
                    .length &&
                  (
                    (node.children[findingObj.idx] as any).children[
                      curr
                    ] as TagTokenWithChildren
                  ).attribs.some(
                    (attrib) =>
                      attrib.attribName === "colspan" &&
                      attrib.attribValue &&
                      attrib.attribValue.length &&
                      attrib.attribValue.some((valObjNode) => {
                        if ((valObjNode as any).type === "text") {
                          if (Number.isInteger(+(valObjNode as any).value)) {
                            // drill through and also extract the value
                            temp = +(valObjNode as any).value;
                            return true;
                          }
                          bail = true;
                          console.log(
                            `311 SET ${`\u001b[${31}m${`bail`}\u001b[${39}m`} = ${bail}`
                          );
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
            if (bail) {
              console.log(
                `325 ${`\u001b[${31}m${`code is broken, bail early`}\u001b[${39}m`}`
              );
              return;
            }
            console.log(
              `330 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spans`}\u001b[${39}m`} = ${JSON.stringify(
                spans,
                null,
                4
              )}`
            );
            let uniqueSpans = new Set(spans);
            // console.log(
            //   `268 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`uniqueSpans`}\u001b[${39}m`} = ${JSON.stringify(
            //     [...uniqueSpans],
            //     null,
            //     4
            //   )}`
            // );

            let tdCounts = extracted.map((e) => e.tds.length);
            console.log(
              `347 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tdCounts`}\u001b[${39}m`} = ${JSON.stringify(
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
                `360 ${`\u001b[${31}m${`COLSPAN ISSUE!`}\u001b[${39}m`}`
              );

              let tdMaxCountPerRow = Math.max(...tdCounts);
              console.log(
                `365 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tdMaxCountPerRow`}\u001b[${39}m`} = ${tdMaxCountPerRow}`
              );

              // 1. rows where there's lesser amount of TD's and possibly colspan is missing/wrong
              extracted
                // rows with lesser
                .filter((e) => e.tds.length !== tdMaxCountPerRow)
                .forEach((e) => {
                  console.log(
                    `374 ${`\u001b[${90}m${`~`.repeat(80)}\u001b[${39}m`}`
                  );
                  console.log(
                    `377 ${`\u001b[${33}m${`e`}\u001b[${39}m`} = ${JSON.stringify(
                      e,
                      null,
                      4
                    )}`
                  );

                  console.log(
                    `385 FIY, ${`\u001b[${33}m${`e.tds.length`}\u001b[${39}m`} = ${
                      e.tds.length
                    }; ${`\u001b[${33}m${`spans[e.orderNumber=${e.orderNumber}]`}\u001b[${39}m`} = ${
                      spans[e.orderNumber]
                    }`
                  );
                  if (e.tds.length === 1) {
                    console.log(`392 one TD only`);
                    if (e.tds.length === spans[e.orderNumber]) {
                      console.log(`394 missing colspan`);
                      // position to insert the attribute is to the left of tag token's end,
                      // provided it ends with bracket!
                      let pos =
                        (node.children[e.idx] as any).children[e.tds[0]].end -
                        1;
                      context.report({
                        ruleId: "tag-table",
                        message: `Add a collspan.`,
                        idxFrom: (node.children[e.idx] as any).children[
                          e.tds[0]
                        ].start,
                        idxTo: (node.children[e.idx] as any).children[e.tds[0]]
                          .end,
                        fix: {
                          ranges: [
                            [pos, pos, ` colspan="${tdMaxCountPerRow}"`],
                          ],
                        },
                      });
                    } else {
                      console.log(`415 problematic colspan`);
                      let attribsOfCulpridTd = (node.children[e.idx] as any)
                        .children[e.tds[0]].attribs;
                      for (
                        let z = 0, len3 = attribsOfCulpridTd.length;
                        z < len3;
                        z++
                      ) {
                        console.log(
                          `424 ${`\u001b[${36}m${`processing ${attribsOfCulpridTd[z].attribName}`}\u001b[${39}m`}`
                        );
                        if (attribsOfCulpridTd[z].attribName === "colspan") {
                          console.log(
                            `428 ${`\u001b[${32}m${`replace the colspan value`}\u001b[${39}m`}`
                          );
                          console.log(
                            `431 ${`\u001b[${33}m${`attribsOfCulpridTd[z]`}\u001b[${39}m`} = ${JSON.stringify(
                              attribsOfCulpridTd[z],
                              null,
                              4
                            )}`
                          );
                          context.report({
                            ruleId: "tag-table",
                            message: `Should be colspan="${tdMaxCountPerRow}".`,
                            idxFrom: attribsOfCulpridTd[z].attribStarts,
                            idxTo: attribsOfCulpridTd[z].attribEnds,
                            fix: {
                              ranges: [
                                [
                                  attribsOfCulpridTd[z].attribValueStartsAt,
                                  attribsOfCulpridTd[z].attribValueEndsAt,
                                  `${tdMaxCountPerRow}`,
                                ],
                              ],
                            },
                          });
                          console.log(
                            `453 ${`\u001b[${36}m${`BREAK`}\u001b[${39}m`}`
                          );
                          break;
                        }
                      }
                    }
                  } else {
                    console.log(`460 default fallback - complain on the TR`);
                    context.report({
                      ruleId: "tag-table",
                      message: `Should contain ${tdMaxCountPerRow} td's.`,
                      idxFrom: node.children[e.idx].start,
                      idxTo: node.children[e.idx].end,
                      fix: null,
                    });
                  }
                });

              // 2. td count can be even but there might be a wrong colspan:
              //
              // <table>
              //   <tr>
              //     <td colspan="2">1</td>
              //         ^^^^^^^^^^^
              //     <td>2</td>
              //   </tr>
              //   <tr>
              //     <td>1</td>
              //     <td>2</td>
              //   </tr>
              // </table>

              tdCounts.forEach((tdCount, idx) => {
                if (
                  // td count is correct:
                  tdCount === tdMaxCountPerRow &&
                  // but because of colspans, the total span is off
                  spans[idx] > tdCount
                ) {
                  console.log(
                    `493 ${`\u001b[${31}m${`remove colspan`}\u001b[${39}m`}`
                  );
                  extracted[idx].tds.forEach((tdIdx) => {
                    // tdIdx
                    let currentTd = (node.children[extracted[idx].idx] as any)
                      .children[tdIdx];
                    // console.log(
                    //   `${`\u001b[${33}m${`currentTd`}\u001b[${39}m`} = ${JSON.stringify(
                    //     currentTd,
                    //     null,
                    //     4
                    //   )}`
                    // );
                    (currentTd.attribs as Attrib[])
                      .filter((attrib) => attrib.attribName === "colspan")
                      .forEach((attrib) => {
                        console.log(
                          `${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                            attrib,
                            null,
                            4
                          )}`
                        );
                        console.log(
                          `517 ${`\u001b[${32}m${`remove the colspan`}\u001b[${39}m`}`
                        );
                        context.report({
                          ruleId: "tag-table",
                          message: `Remove the colspan.`,
                          idxFrom: attrib.attribStarts,
                          idxTo: attrib.attribEnds,
                          fix: {
                            ranges: [
                              [attrib.attribLeft + 1, attrib.attribEnds],
                            ],
                          },
                        });
                      });
                  });
                }
              });
            }
          }
        } else {
          console.log(
            `538 ${`\u001b[${32}m${`no children tokens, tr missing`}\u001b[${39}m`}`
          );
          context.report({
            ruleId: "tag-table",
            message: `Missing children <tr> tags.`,
            idxFrom: node.start,
            idxTo: node.end,
            fix: null,
          });
        }
      } else if (
        node.tagName === "tr" &&
        !node.closing &&
        node.children &&
        node.children.length &&
        node.children.some((n) => n.type === "text" && n.value.trim())
      ) {
        console.log(
          `556 ${`\u001b[${31}m${`rogue intra-tag characters!`}\u001b[${39}m`}`
        );
        node.children
          .filter((n) => n.type === "text" && n.value.trim())
          .forEach((n) => {
            context.report({
              ruleId: "tag-table",
              message: `Rogue character${
                n.value.trim().length > 1 ? "s" : ""
              } between tags.`,
              idxFrom: n.start,
              idxTo: n.end,
              fix: null,
            });
          });
      } else if (node.tagName === "td" && !node.closing) {
        console.log(`572 td`);
        console.log(
          `574 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );
        if (
          !node.children ||
          !node.children.length ||
          !node.children.some((n) => n.type !== "text" || n.value.trim())
        ) {
          context.report({
            ruleId: "tag-table",
            message: `Empty <td> tag.`,
            idxFrom: node.start,
            idxTo: node.end,
            fix: null,
          });
        }
      }
    },
  };
}

export default tagTable;
