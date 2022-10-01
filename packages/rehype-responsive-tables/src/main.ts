import type { Plugin } from "unified";
import type {
  Root,
  // Element,
  ElementContent,
} from "hast";
import { visit } from "unist-util-visit";

declare let DEV: boolean;

interface Obj {
  [key: string]: any;
}

export interface Opts {
  /**
   * plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  tableClassName: string;
  /**
   * plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  newTrClassName: string;
  /**
   * first TD of each TR in the result table will have this class
   */
  hideTdClassName: string;
}

const defaults: Opts = {
  tableClassName: "rrt-table",
  newTrClassName: "rrt-new-tr",
  hideTdClassName: "rrt-del-td",
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
      `059 final ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
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
            `087 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
              node,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `095 ${`\u001b[${33}m${`tdCount`}\u001b[${39}m`} = ${JSON.stringify(
              tdCount,
              null,
              4
            )}`
          );

        if (tdCount > 1) {
          // 1. TACKLE TD'S
          node.children = node.children.reduce((acc, curr) => {
            if ((curr as Obj).tagName !== "tr") {
              return [...acc, curr];
            }
            let firstTdVal = "";
            let firstTdChildren: Obj[] = [];
            for (
              let i = 0, len = (curr as Obj)?.children?.length;
              i < len;
              i++
            ) {
              // it depends, what's inside the td: string (will go to firstTdVal) or
              // children array (will go to firstTdChildren)
              if (!firstTdVal && (curr as Obj)?.children[i]?.tagName === "td") {
                DEV && console.log(`118`);
                if ((curr as Obj).children[i].value) {
                  firstTdVal = (curr as Obj)?.children[i]?.children[0]?.value;
                  DEV &&
                    console.log(
                      `123 SET ${`\u001b[${33}m${`firstTdVal`}\u001b[${39}m`} = ${JSON.stringify(
                        firstTdVal,
                        null,
                        4
                      )}`
                    );
                } else if ((curr as Obj).children[i].children) {
                  firstTdChildren = (curr as Obj).children[i].children;
                  DEV &&
                    console.log(
                      `133 SET ${`\u001b[${33}m${`firstTdChildren`}\u001b[${39}m`} = ${JSON.stringify(
                        firstTdChildren,
                        null,
                        4
                      )}`
                    );
                }
                break;
              }
            }

            // at this point, we know it's a <tr>
            // let's insert a new <tr> above it
            return [
              ...acc,
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
                    properties:
                      tdCount > 2
                        ? {
                            colSpan: `${tdCount - 1}`,
                          }
                        : {},
                    children: firstTdChildren
                      ? Array.from(firstTdChildren)
                      : [],
                  },
                ],
              },
              addClassToFirstTd(curr, resolvedOpts.hideTdClassName),
            ];
          }, <ElementContent[]>[]);

          // 2. TACKLE THEAD VIA PARENT
          if (parent.children.some((c: Obj) => c.tagName === "thead")) {
            DEV && console.log(`184 thead found`);
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
                      return {
                        ...chl,
                        children: chl.children.reduce(
                          (acc: Obj[], curr2: Obj) => {
                            if (!firstThHasBeenSet && curr2.tagName === "th") {
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
        }

        // 3. ADD A CLASS TO PARENT TABLE
        // (no matter what we processed)

        DEV &&
          console.log(
            `236 ${`\u001b[${33}m${`parent`}\u001b[${39}m`} = ${JSON.stringify(
              parent,
              null,
              4
            )}`
          );

        // insurance in case "properties" key's value is not a plain obj
        if (typeof (parent as Obj).properties !== "object") {
          (parent as Obj).properties = {};
        }

        if (!Array.isArray((parent as Obj).properties.className)) {
          (parent as Obj).properties.className = [];
        }
        (parent as Obj).properties.className.push("rrt-table");
      }
    });
  };
};

export default rehypeResponsiveTables;
