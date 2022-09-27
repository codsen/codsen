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
  newTrClassName: string;
  /**
   * first TD of each TR in the result table will have this class
   */
  hideTdClassName: string;
}

const defaults: Opts = {
  newTrClassName: "rrt-new-tr",
  hideTdClassName: "rrt-del-td",
};

function addClassToFirstTd(node: ElementContent, className: string) {
  let firstTdMet = false;
  return {
    ...node,
    children: (node as any).children.map((c: any) => {
      if (!firstTdMet && c.tagName === "td") {
        firstTdMet = true;
        return {
          ...c,
          properties: { ...c.properties, class: className },
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
      `053 final ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
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
          if ((childElem as any).tagName === "tr") {
            tdCount = (childElem as any).children.filter(
              (c: any) => c.tagName === "td"
            ).length;
            return true;
          }
        })
      ) {
        DEV &&
          console.log(
            `081 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
              node,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `089 ${`\u001b[${33}m${`tdCount`}\u001b[${39}m`} = ${JSON.stringify(
              tdCount,
              null,
              4
            )}`
          );

        // 0. EARLY EXIT

        if (tdCount < 2) {
          return;
        }

        // 1. TACKLE TD'S

        node.children = node.children.reduce((acc, curr) => {
          if ((curr as any).tagName !== "tr") {
            return [...acc, curr];
          }
          let firstTdVal = "";
          for (let i = 0, len = (curr as any)?.children?.length; i < len; i++) {
            if (!firstTdVal && (curr as any)?.children[i]?.tagName === "td") {
              firstTdVal = (curr as any)?.children[i]?.children[0]?.value;
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
                  children: [
                    {
                      type: "text",
                      value: firstTdVal,
                    },
                  ],
                },
              ],
            },
            addClassToFirstTd(curr, resolvedOpts.hideTdClassName),
          ];
        }, <ElementContent[]>[]);

        // 2. TACKLE THEAD VIA PARENT

        if (parent.children.some((c: any) => c.tagName === "thead")) {
          DEV && console.log(`160 thead found`);
          parent.children = parent.children.map((ch) => {
            if (
              (ch as any).tagName === "thead" &&
              Array.isArray((ch as any).children) &&
              (ch as any).children.length
            ) {
              return {
                ...ch,
                children: (ch as any).children.map((chl: any) => {
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
    });
  };
};

export default rehypeResponsiveTables;
