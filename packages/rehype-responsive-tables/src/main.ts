import type { Plugin } from "unified";
import type {
  Root,
  // Element,
  ElementContent,
} from "hast";
import { visit } from "unist-util-visit";
import { contains, getNthChildTag, Obj } from "./util";

export { contains, getNthChildTag };

declare let DEV: boolean;

export interface Opts {
  /**
   * Plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  tableClassName: string;
  /**
   * Plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  newTrClassName: string;
  /**
   * The first TD of each TR in the result table will have this class
   */
  hideTdClassName: string;
  /**
   * When cells are stacked, it's necessary to visually separate
   * the blocks. This plugin will add a gap <tr> above
   */
  gapTrClassName: string;
  /**
   * When the first column is "lifted" up, its contents are wrapped
   * with a span which will contain this CSS class
   */
  newTrSpanClassName: string;
  /**
   * Lift the following cells' contents up, under the first column
   */
  up: string[];
  /**
   * Move the following cells' contents under the table, full-width cell
   */
  // down: string[];
  /**
   * On narrow viewports sticky thead does not make sense any more, so
   * each <tr> group gets it own, equivalent of <thead>. Now, if
   * all heading cell values are covered by this blacklist, this
   * <thead> equivalent row won't be displayed.
   */
  newTheadBlacklist: string[];
}

export const defaults: Opts = {
  tableClassName: "rrt-table",
  newTrClassName: "rrt-new-tr",
  hideTdClassName: "rrt-del-td",
  gapTrClassName: "rrt-gap-tr",
  newTrSpanClassName: "rrt-new-tr-span",
  up: [],
  // down: [],
  newTheadBlacklist: [],
};

function addClassToFirstTd(node: ElementContent, className: string) {
  let firstTdMet = false;
  return {
    ...node,
    children: (node as Obj).children.map((c: Obj) => {
      if (!firstTdMet && c.tagName === "td") {
        firstTdMet = true;
        return {
          ...c,
          properties: { ...c.properties, className: className },
        };
      }
      return c;
    }),
  };
}

const rehypeResponsiveTables: Plugin<[Partial<Opts>?], Root> = (opts) => {
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `088 final ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      let tdCount = 0;
      if (
        parent &&
        index &&
        node.tagName === "tbody" &&
        // with children
        Array.isArray(node.children) &&
        node.children.length &&
        node.children.some((childElem) => {
          if ((childElem as Obj).tagName === "tr") {
            tdCount = (childElem as Obj).children.filter(
              (c: Obj) => c.tagName === "td"
            ).length;
            return true;
          }
        })
      ) {
        DEV &&
          console.log(
            `116 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
              node,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `124 ${`\u001b[${33}m${`tdCount`}\u001b[${39}m`} = ${JSON.stringify(
              tdCount,
              null,
              4
            )}`
          );

        if (tdCount > 1) {
          let theadChildrenToSet: Obj[] = [];

          // 1. TACKLE THEAD VIA PARENT
          if (parent.children.some((c: Obj) => c.tagName === "thead")) {
            DEV && console.log(`136 thead found`);
            parent.children = parent.children.map((ch) => {
              if (
                (ch as Obj).tagName === "thead" &&
                Array.isArray((ch as Obj).children) &&
                (ch as Obj).children.length
              ) {
                return {
                  ...ch,
                  children: (ch as Obj).children.map((chl: Obj) => {
                    if (
                      chl.tagName === "tr" &&
                      Array.isArray(chl.children) &&
                      chl.children.length
                    ) {
                      let firstThHasBeenSet = false;

                      // there can be whitespace nodes among <th> nodes so we need
                      // to omit them, to count only th's, so that later we can
                      // set the corresponding n-th <td>'s.
                      let thCounter = 0;

                      return {
                        ...chl,
                        children: chl.children.reduce(
                          (acc: Obj[], curr2: Obj) => {
                            DEV &&
                              console.log(
                                `164 ${`\u001b[${33}m${`curr2`}\u001b[${39}m`} = ${JSON.stringify(
                                  curr2,
                                  null,
                                  4
                                )}`
                              );

                            let matchedUpVal: string | undefined = undefined;
                            if (curr2.tagName === "th") {
                              // 1-0.
                              thCounter++;

                              // 1-1.
                              if (
                                // either wildcard,
                                resolvedOpts.up.some((v) => v === "*") ||
                                // or exact match
                                (matchedUpVal = contains(
                                  curr2,
                                  resolvedOpts.up
                                ))
                              ) {
                                DEV &&
                                  console.log(
                                    `188 ${`\u001b[${32}m${`CONTAINS ${matchedUpVal}`}\u001b[${39}m`}`
                                  );
                                // make a note of this
                                theadChildrenToSet.push({
                                  thIdx: thCounter - 1,
                                  matchedUpVal,
                                  children: Array.from(curr2.children).filter(
                                    (ch2: any) =>
                                      !(
                                        ch2.type === "text" && !ch2.value.trim()
                                      )
                                  ),
                                });

                                // add a class on th
                                if (
                                  !Array.isArray(curr2.properties.className)
                                ) {
                                  curr2.properties.className = [];
                                }
                                curr2.properties.className.push(
                                  resolvedOpts.hideTdClassName
                                );
                              }

                              // 1-2.
                              if (!firstThHasBeenSet) {
                                firstThHasBeenSet = true;
                                return [
                                  ...acc,
                                  {
                                    ...curr2,
                                    properties: {
                                      className: [resolvedOpts.hideTdClassName],
                                    },
                                  },
                                ];
                              }
                            }
                            return [...acc, curr2];
                          },
                          <Obj[]>[]
                        ),
                      };
                    }
                    return chl;
                  }),
                };
              }
              return ch;
            });
          }

          DEV &&
            console.log(
              `243 final gathered ${`\u001b[${33}m${`theadChildrenToSet`}\u001b[${39}m`} = ${JSON.stringify(
                theadChildrenToSet,
                null,
                4
              )}`
            );

          let trCounter = -1;
          // 2. TACKLE TD'S
          node.children = node.children.reduce((acc, curr) => {
            if ((curr as Obj).tagName === "tr") {
              trCounter++;
              DEV &&
                console.log(
                  `257 ${`\u001b[${33}m${`trCounter`}\u001b[${39}m`} = ${JSON.stringify(
                    trCounter,
                    null,
                    4
                  )}`
                );
            }

            if (
              (curr as Obj).tagName !== "tr" ||
              !(curr as Obj)?.children?.length
            ) {
              return [...acc, curr];
            }
            let firstTdVal = "";
            let firstTdChild: Obj[] = [];
            let tdCounter = 0;

            for (
              let i = 0, len = (curr as Obj)?.children?.length;
              i < len;
              i++
            ) {
              // it depends, what's inside the td: string (will go to firstTdVal) or
              // children array (will go to firstTdChildren)

              if ((curr as Obj)?.children[i]?.tagName === "td") {
                tdCounter++;
                DEV &&
                  console.log(
                    `287 - inside td ${(curr as Obj)?.children[
                      i
                    ]?.children[0].value.trim()} #${tdCounter}`
                  );

                // 2-1. extract the first <td>'s child/value
                if (!firstTdVal && !firstTdChild.length) {
                  if ((curr as Obj).children[i].value) {
                    firstTdVal = (curr as Obj)?.children[i]?.children[0]?.value;
                    DEV &&
                      console.log(
                        `298 SET ${`\u001b[${33}m${`firstTdVal`}\u001b[${39}m`} = ${JSON.stringify(
                          firstTdVal,
                          null,
                          4
                        )}`
                      );
                  } else if ((curr as Obj).children[i].children) {
                    firstTdChild = (curr as Obj).children[i].children;
                    DEV &&
                      console.log(
                        `308 SET ${`\u001b[${33}m${`firstTdChild`}\u001b[${39}m`} = ${JSON.stringify(
                          firstTdChild,
                          null,
                          4
                        )}`
                      );
                  }
                }

                // 2-2.
                if (
                  theadChildrenToSet.some((c) => {
                    return c.thIdx === tdCounter - 1;
                  })
                ) {
                  DEV && console.log(`323 this td was moved up`);
                  if (
                    !Array.isArray(
                      (curr as Obj).children[i].properties.className
                    )
                  ) {
                    (curr as Obj).children[i].properties.className = [];
                  }
                  (curr as Obj).children[i].properties.className.push(
                    resolvedOpts.hideTdClassName
                  );
                  DEV &&
                    console.log(
                      `336 final ${`\u001b[${33}m${`(curr as Obj).children[i]`}\u001b[${39}m`} = ${JSON.stringify(
                        (curr as Obj).children[i],
                        null,
                        4
                      )}`
                    );
                }
              }
            }

            let secondTdProperties =
              tdCount > 2
                ? {
                    colSpan: `${tdCount - 1}`,
                  }
                : {};

            // at this point, we know it's a <tr>
            // let's insert a new <tr> above it
            return [
              ...acc,
              trCounter > 0
                ? {
                    type: "element",
                    tagName: "tr",
                    properties: {
                      className: [resolvedOpts.gapTrClassName],
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "td",
                        properties: {
                          className: [resolvedOpts.hideTdClassName],
                        },
                        children: [],
                      },
                      {
                        type: "element",
                        tagName: "td",
                        properties: secondTdProperties,
                        children: [],
                      },
                    ],
                  }
                : (null as any),
              {
                type: "element",
                tagName: "tr",
                properties: {
                  className: [resolvedOpts.newTrClassName],
                },
                children: [
                  {
                    type: "element",
                    tagName: "td",
                    properties: {
                      className: [resolvedOpts.hideTdClassName],
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "td",
                    properties: secondTdProperties,
                    children: [
                      {
                        type: "element",
                        tagName: "span",
                        properties: {
                          className: [resolvedOpts.newTrSpanClassName],
                        },
                        children: [...firstTdChild],
                      },
                    ].concat(
                      (theadChildrenToSet as any[]).reduce((acc2, curr2) => {
                        DEV &&
                          console.log(
                            `414 ███████████████████████████████████████ ${`\u001b[${33}m${`curr`}\u001b[${39}m`} = ${JSON.stringify(
                              curr,
                              null,
                              4
                            )}`
                          );

                        let tdValue = getNthChildTag(curr, "td", curr2.thIdx);
                        DEV &&
                          console.log(
                            `424 retrieved ${`\u001b[${33}m${`tdValue`}\u001b[${39}m`} = ${JSON.stringify(
                              tdValue,
                              null,
                              4
                            )}`
                          );

                        return acc2
                          .concat([
                            {
                              type: "element",
                              tagName: "br",
                              properties: {},
                              children: [],
                            },
                          ])
                          .concat(curr2.children)
                          .concat([
                            {
                              type: "text",
                              value: ": ",
                            },
                          ])
                          .concat(tdValue ? tdValue.children : []);
                      }, <Obj[]>[])
                    ),
                  },
                ],
              },

              addClassToFirstTd(curr, resolvedOpts.hideTdClassName),
            ].filter(Boolean);
          }, <ElementContent[]>[]);
        }

        // 3. ADD A CLASS TO PARENT TABLE
        // (no matter what we processed)

        // 3.0 insurance in case "properties" key's value is not a plain obj
        if (typeof (parent as Obj).properties !== "object") {
          (parent as Obj).properties = {};
        }

        if (!Array.isArray((parent as Obj).properties.className)) {
          (parent as Obj).properties.className = [];
        }
        (parent as Obj).properties.className.push(resolvedOpts.tableClassName);
      }
    });
  };
};

export default rehypeResponsiveTables;
